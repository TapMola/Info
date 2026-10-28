import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { setTimeout } from 'node:timers/promises'
import { chromium } from '@playwright/test'

// --base mounts the unchanged relative Vite output at the actual Pages prefix.
const url = process.env.PRODUCTION_URL || 'http://127.0.0.1:4173/Info/'
const preview = process.env.PRODUCTION_URL ? null : spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort', '--base', '/Info/',
], { stdio: ['ignore', 'pipe', 'pipe'] })
let output = ''; let serverError
preview?.stdout.on('data', data => { output += data })
preview?.stderr.on('data', data => { output += data })
preview?.on('error', error => { serverError = error })
let browser
try {
  if (preview) {
    let ready = false
    for (let i = 0; i < 100; i++) {
      if (serverError || preview.exitCode !== null) throw serverError || new Error(`Vite preview falló: ${output}`)
      if (output.includes('Local:')) { ready = true; break }
      await setTimeout(100)
    }
    assert.ok(ready, `Vite preview no arrancó: ${output}`)
  }
  const response = await fetch(url)
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.doesNotMatch(html, /\/src\/main\.tsx/, 'El servidor está publicando el HTML fuente')
  assert.match(html, /\/assets\/.+\.js/, 'No se está sirviendo la entrada compilada')

  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || (existsSync(macChrome) ? macChrome : undefined) })
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`))
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    await page.goto(url)
    await page.locator('#hero-heading').waitFor({ state: 'visible' })
    for (const id of ['producto', 'experiencia', 'como-funciona', 'personalizar', 'precios', 'pedido', 'contacto']) assert.equal(await page.locator(`#${id}`).count(), 1, `Falta ${id}`)
    await page.locator('#name').fill('Prueba producción')
    await page.locator('#email').fill('prueba@example.com')
    assert.equal(await page.locator('.preview-column .digital-card h3').textContent(), 'Prueba producción')
    await page.getByRole('button', { name: 'Añadir información' }).click()
    await page.locator('#field-menu').getByRole('button', { name: 'Instagram', exact: true }).click()
    await page.locator('#instagram').fill('https://example.com/perfil')
    await page.getByRole('button', { name: 'Natural', exact: true }).click()
    assert.equal(await page.locator('.preview-column .theme-natural').count(), 1)
    await page.getByRole('link', { name: 'Elegir 2 tarjetas por 30 euros' }).click()
    assert.match(await page.locator('.summary-total').textContent(), /30 €/)
    await page.getByRole('button', { name: 'Probar demostración' }).click()
    await page.getByText('Perfil digital de Laura Martínez abierto.').waitFor()
    await page.getByRole('button', { name: 'Volver a probar' }).click()
    await page.goto(`${url}#personalizar`)
    await page.reload()
    await page.locator('#customizer-form').waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desbordamiento horizontal')
    assert.deepEqual(errors, [], `Errores de producción a ${width}px`)
    await page.goto(url)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${tmpdir()}/tapmola-production-${width}.png` })
    console.log(`PASS: React, recursos, personalización, precios, NFC y recarga bajo /Info/ a ${width}px; sin errores de consola.`)
    await page.close()
  }
} finally {
  await browser?.close()
  if (preview && preview.exitCode === null) {
    preview.kill('SIGTERM')
    await new Promise(resolve => preview.once('exit', resolve))
  }
}
