import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import { existsSync } from 'node:fs'
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const executablePath = process.env.CHROME_PATH || (existsSync(macChrome) ? macChrome : undefined)
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []; page.on('pageerror', e => errors.push(e.message))
await page.goto('http://127.0.0.1:5173'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1700)
await page.screenshot({ path: `${tmpdir()}/tapmola-desktop.png`, fullPage: true }); await page.screenshot({ path: `${tmpdir()}/tapmola-hero.png` })
await page.getByRole('button', { name: 'Probar demostración' }).click()
await page.getByText('Perfil digital de Laura Martínez abierto.').waitFor()
await page.getByRole('button', { name: 'Volver a probar' }).click()
await page.getByRole('button', { name: 'Probar demostración' }).waitFor({ state: 'visible' })
await page.locator('.draggable-card').waitFor(); await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById('experiencia').scrollIntoView() });
// Trigger the same activation by dragging to the actual phone activation region.
const phone = await page.locator('.phone').boundingBox()
const drag = await page.locator('.draggable-card').boundingBox()
await page.mouse.move(drag.x+80, drag.y+50); await page.mouse.down(); await page.mouse.move(phone.x+phone.width/2,phone.y+60,{steps:20}); await page.mouse.up()
await page.getByText('Perfil digital de Laura Martínez abierto.').waitFor()
await page.locator('#name').fill('Inés Núñez'); await page.locator('#email').fill('ines@example.com'); await page.getByPlaceholder('El nombre de tu proyecto').fill('Estudio Inés')
await page.getByRole('button', { name: 'Añadir información' }).click(); await page.getByRole('button', { name: 'Profesión o cargo', exact: true }).click(); await page.locator('#role').fill('Arquitecta')
await page.getByRole('button', { name: 'Añadir información' }).click(); await page.locator('#field-menu').getByRole('button', { name: 'Instagram', exact: true }).click(); await page.locator('#instagram').fill('https://instagram.com/estudio-ejemplo')
await page.getByRole('button', { name: 'Natural', exact: true }).click()
assert.equal(await page.locator('.preview-column .digital-card.theme-natural').count(),1)
assert.equal(await page.locator('.preview-column .digital-card h3').textContent(),'Inés Núñez')
await page.locator('#logo-upload').setInputFiles({name:'logo.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGN0AAAAASUVORK5CYII=','base64')})
await page.locator('.profile-logo img').waitFor()
await page.getByRole('link', { name: 'Elegir 2 tarjetas por 30 euros' }).click()
assert.ok((await page.locator('.summary-total').textContent()).includes('30 €'))
assert.ok((await page.locator('.order-summary').textContent()).includes('logo.png'))
// Intercept window.open: inspect the actual generated Gmail request without external navigation or sending.
await page.evaluate(() => { window.open = (url) => { window.__orderUrl = url; return null } })
await page.getByRole('button', { name: 'O preparar el email en Gmail' }).click()
await page.getByText('Solicitud preparada para tu correo', { exact:true }).waitFor()

const url = new URL(await page.evaluate(() => window.__orderUrl)); assert.equal(url.searchParams.get('to'),'tapmolanfc@gmail.com'); assert.ok(url.searchParams.get('body').includes('Total: 30 €')); assert.ok(url.searchParams.get('body').includes('adjuntar el archivo manualmente'))
await page.getByRole('button', { name: 'Quitar logo', exact:true }).click(); assert.equal(await page.locator('.profile-logo img').count(),0)
await page.getByRole('button', { name: 'Quitar Instagram', exact:true }).click(); await page.locator('#instagram').waitFor({state:'detached'})
await page.getByRole('button', {name:'Añadir información'}).click(); await page.locator('#field-menu').getByRole('button', {name:'Otro enlace',exact:true}).click(); await page.getByPlaceholder('Mi portfolio').fill('Portfolio'); await page.getByPlaceholder('https://…',{exact:true}).fill('https://example.com/portfolio'); assert.ok((await page.locator('.order-summary').textContent()).includes('Portfolio')); await page.getByRole('button',{name:'Quitar enlace 1'}).click()
await page.locator('#logo-upload').setInputFiles({name:'not-image.txt',mimeType:'text/plain',buffer:Buffer.from('no image')}); assert.ok((await page.locator('#logo-error').textContent()).includes('Elige una imagen'))
const invalid = await browser.newPage(); await invalid.goto('http://127.0.0.1:5173'); await invalid.getByRole('button', {name:'Solicitar mi tarjeta',exact:true}).click(); assert.equal(await invalid.locator('#name').evaluate(el => el.validity.valid),false); assert.equal(await invalid.locator('.order-prepared').count(),0); await invalid.close()
for (const width of [320, 375, 390, 768, 1024, 1440]) {
  await page.setViewportSize({width,height:900}); await page.evaluate(() => window.scrollTo(0,0));
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  if (!fits) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => ({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).slice(0,35)))
  assert.ok(fits, `Horizontal overflow at ${width}`)
  if(width === 390) await page.screenshot({path:`${tmpdir()}/tapmola-mobile.png`,fullPage:true})
}
await page.setViewportSize({width:390,height:844}); await page.getByRole('button',{name:'Abrir menú',exact:true}).click(); await page.locator('#mobile-menu').getByRole('link',{name:'Precios'}).click(); assert.equal(await page.getByRole('button',{name:'Abrir menú',exact:true}).getAttribute('aria-expanded'),'false')
await page.emulateMedia({reducedMotion:'reduce'}); await page.reload(); await page.getByRole('button',{name:'Probar demostración'}).click(); await page.getByText('Perfil digital de Laura Martínez abierto.').waitFor(); assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),'auto')
assert.deepEqual(errors,[])
console.log('PASS: desktop NFC button + drag + reset; live fields and themes; logo upload, rejection and removal; pricing; validated email composition; required fields; mobile menu; 320–1440px overflow; reduced motion; no runtime errors.')
if (process.env.GENERATE_SOCIAL === '1') { const social = await browser.newPage({ viewport: {width:1200,height:850}, reducedMotion:'reduce' }); await social.goto('http://127.0.0.1:5173'); await social.evaluate(() => document.fonts.ready); await social.screenshot({path:'public/social-preview.png'}); } await browser.close()
