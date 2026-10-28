import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || (existsSync(chrome) ? chrome : undefined), headless: true })
const failures = []
const scenarios = [
  ...[1920, 1440, 1280, 1024, 768, 390, 375].map(width => ({ width, zoom: 1 })),
  ...[125, 150].flatMap(percent => [1920, 1440, 1280, 1024].map(width => ({ width, zoom: percent / 100 }))),
]
for (const { width, zoom } of scenarios) {
  // Desktop zoom changes both the available CSS viewport and device/CSS pixel ratio.
  const cssWidth = Math.floor(width / zoom)
  const page = await browser.newPage({ viewport: { width: cssWidth, height: Math.floor(1000 / zoom) }, deviceScaleFactor: zoom, reducedMotion: 'reduce' })
  page.on('pageerror', error => failures.push(error.message))
  await page.goto('http://127.0.0.1:5173')
  await page.evaluate(() => document.fonts.ready)
  await page.locator('#personalizar').scrollIntoViewIfNeeded()
  assert.equal(await page.locator('.heading-spark svg[stroke="currentColor"]').count(), 1)
  assert.equal(await page.locator('.tiny-card svg, .physical-mark svg, .phone-indicators svg, .footer-bottom a svg').count(), 8)
  const geometry = () => page.evaluate(() => {
    const rect = selector => { const e = document.querySelector(selector); const r = e.getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width, scrollWidth: e.scrollWidth, clientWidth: e.clientWidth } }
    return { form: rect('.customizer-form'), preview: rect('.preview-column'), layout: rect('.customizer-layout'), documentWidth: document.documentElement.scrollWidth, viewport: innerWidth }
  })
  const initial = await geometry()
  async function stable(step) {
    const current = await geometry()
    for (const key of ['form', 'preview']) {
      if (Math.abs(current[key].left - initial[key].left) > 1 || Math.abs(current[key].width - initial[key].width) > 1) failures.push(`${width}px / ${zoom * 100}% ${step}: ${key} changed horizontally: ${JSON.stringify({ before: initial[key], after: current[key] })}`)
      if (current[key].scrollWidth > current[key].clientWidth + 1) failures.push(`${width}px / ${zoom * 100}% ${step}: ${key} content overflow`)
    }
    if (current.form.left < current.layout.left - 1 || current.form.right > current.layout.right + 1 || current.preview.right > current.layout.right + 1 || current.documentWidth > current.viewport) failures.push(`${width}px / ${zoom * 100}% ${step}: configurator outside its columns`)
    if (cssWidth > 560 && current.form.right > current.preview.left) failures.push(`${width}px / ${zoom * 100}% ${step}: columns overlap`)
  }
  await page.locator('#name').fill('Laura Martínez')
  await page.locator('#email').fill(`${'a'.repeat(110)}@example.com`)
  await stable('long email')
  for (const [key, label, value] of [
    ['instagram', 'Instagram', 'https://instagram.com/' + 'estudio'.repeat(65)],
    ['linkedin', 'LinkedIn', 'https://linkedin.com/in/' + 'profesional'.repeat(40)],
    ['role', 'Profesión o cargo', 'Diseñadora de interiores'],
    ['website', 'Página web', 'https://example.com/' + 'portfolio'.repeat(50)],
    ['location', 'Ubicación', 'Madrid, España'],
    ['phone', 'Teléfono', '+34 600 000 000'],
  ]) {
    await page.getByRole('button', { name: 'Añadir información' }).click()
    await stable(`menu for ${key}`)
    await page.locator('#field-menu').getByRole('button', { name: label, exact: true }).click()
    await stable(`add ${key}`)
    for (const count of [12, 100, value.length]) {
      await page.locator(`#${key}`).fill(value.slice(0, count))
      await stable(`type ${key} ${count}`)
    }
  }
  await page.getByRole('button', { name: 'Añadir información' }).click()
  await page.locator('#field-menu').getByRole('button', { name: 'Otro enlace', exact: true }).click()
  await page.getByPlaceholder('Mi portfolio').fill('Portfolio')
  await page.getByPlaceholder('https://…', { exact: true }).fill('https://example.com/' + 'a'.repeat(470))
  await stable('custom link')
  if ([1440, 390].includes(width) && zoom === 1) await page.locator('#personalizar').screenshot({ path: `${tmpdir()}/tapmola-configurator-${width}.png` })
  for (const label of ['Instagram', 'LinkedIn', 'Profesión o cargo']) {
    await page.getByRole('button', { name: `Quitar ${label}`, exact: true }).click()
    await stable(`remove ${label}`)
  }
  // Resize with populated fields; the column layout must still stay within its grid.
  for (const nextWidth of [1024, 768, 390, cssWidth]) {
    await page.setViewportSize({ width: nextWidth, height: 900 })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const r = await geometry()
    if (r.documentWidth > r.viewport) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.editorial-scene,.product-visual,.phone,.demo-stage,.final-cta,.digital-cover')).map(e => ({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,60)})).slice(0,30)))
    assert.ok(r.documentWidth <= r.viewport, `Resize ${width} -> ${nextWidth}: page overflow`)
    assert.ok(r.form.right <= r.layout.right + 1 && r.preview.right <= r.layout.right + 1, `Resize ${width} -> ${nextWidth}: columns outside grid`)
  }
  console.log(`Checked ${width}px at ${zoom * 100}% (${cssWidth}px CSS viewport)`)
  await page.close()
}
await browser.close()
assert.deepEqual(failures, [], failures.slice(0, 8).join('\n'))
console.log(`PASS: stable configurator across ${scenarios.length} viewport/zoom scenarios; long email, Instagram, LinkedIn, optional/custom fields, removal and live resizing.`)
