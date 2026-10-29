import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { PNG } = require(require.resolve('playwright-core/package.json').replace(/package\.json$/, 'lib/utilsBundle.js'))
import { chromium } from '@playwright/test'
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || (existsSync(macChrome) ? macChrome : undefined) })
try {
  let compared = 0
  const desktopWidths = [768, 1024, 1440, 1920]
  for (const width of desktopWidths) {
    const page = await browser.newPage({ viewport: {width, height:1000}, reducedMotion:'reduce' })
    await page.goto('http://127.0.0.1:5173'); await page.evaluate(() => document.fonts.ready)
    const file = `${tmpdir()}/tapmola-desktop-before-${width}.png`
    const screenshot = await page.screenshot({fullPage:true})
    if (process.env.CAPTURE_BASELINE) await page.screenshot({path:file,fullPage:true})
    else if (existsSync(file)) { compared++; await page.screenshot({path:`${tmpdir()}/tapmola-desktop-after-${width}.png`,fullPage:true}); const before = PNG.sync.read(readFileSync(file)), after = PNG.sync.read(screenshot);
      assert.equal(after.width,before.width); assert.equal(after.height,before.height);
      let changedPixels=0;
      for(let i=0;i<before.data.length;i+=4) if([0,1,2,3].some(channel=>Math.abs(before.data[i+channel]-after.data[i+channel])>8)) changedPixels++;
      // Allow isolated SVG edge rasterization differences, never a layout change.
      assert.ok(changedPixels<=10, `Desktop screenshot changed at ${width}px: ${changedPixels} pixels`);
      console.log(`Desktop ${width}px: ${changedPixels} differing edge pixels`) }
    await page.close()
  }
  if (process.env.CAPTURE_BASELINE) console.log('Desktop reference screenshots saved at 768, 1024, 1440 and 1920px.')
  else {
    for (const width of [320, 360, 375, 390, 430, 560, 640, 767]) {
      const page = await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',isMobile:true,hasTouch:true})
      const errors=[]; page.on('pageerror',e=>errors.push(e.message))
      await page.goto('http://127.0.0.1:5173'); await page.evaluate(() => document.fonts.ready)
      const box=selector=>page.locator(selector).boundingBox()
      const visual=await box('.hero-visual'), description=await box('.hero-description')
      const scene=await box('.hero-visual .editorial-scene');
      for(const selector of ['.hero-card-front','.hero-card-back']) { const card=await box(selector); assert.ok(card.x>=scene.x-1 && card.x+card.width<=scene.x+scene.width+1 && card.y>=scene.y-1 && card.y+card.height<=scene.y+scene.height+1,`Product cropped at ${width}: ${selector}`) }
      assert.ok(visual.y < description.y, `Product must precede copy at ${width}`)
      if(width<=430) assert.ok(visual.y < 400, `Product appears too late at ${width}`)
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`)
      if([320,390,430].includes(width)) await page.screenshot({path:`${tmpdir()}/tapmola-mobile-after-${width}.png`,fullPage:true})
      await page.getByRole('button',{name:'Abrir menú',exact:true}).click()
      await page.locator('#mobile-menu a').first().waitFor()
      await page.waitForFunction(()=>document.activeElement?.matches('#mobile-menu a:first-child'))
      assert.equal(await page.locator('#mobile-menu').getByRole('link',{name:'Crear mi tarjeta',exact:true}).isVisible(),true)
      await page.keyboard.press('Escape')
      await page.locator('#mobile-menu').waitFor({state:'detached'})
      assert.equal(await page.getByRole('button',{name:'Abrir menú',exact:true}).evaluate(e=>e===document.activeElement),true)
      await page.locator('#personalizar').scrollIntoViewIfNeeded()
      const preview=await box('.preview-column'), form=await box('.customizer-form')
      assert.ok(preview.y < form.y, `Preview must precede form at ${width}`)
      assert.ok(preview.height < 270, `Compact preview is too tall at ${width}`)
      await page.getByRole('button',{name:'Ver perfil completo',exact:true}).click()
      assert.equal(await page.locator('.preview-column .save-contact').isVisible(),true)
      await page.getByRole('button',{name:'Volver a vista compacta',exact:true}).click()
      await page.locator('#name').fill('Laura Martínez')
      assert.equal(await page.locator('.preview-column .digital-card h3').textContent(),'Laura Martínez')
      await page.getByRole('button',{name:'Añadir información',exact:true}).click()
      await page.locator('#field-menu').getByRole('button',{name:'Instagram',exact:true}).click()
      const original=await box('.customizer-form')
      await page.locator('#instagram').fill('https://instagram.com/'+'estudio'.repeat(60))
      const current=await box('.customizer-form')
      assert.equal(current.width,original.width); assert.equal(current.x,original.x)
      await page.getByRole('button',{name:'Quitar Instagram',exact:true}).click()
      await page.locator('#instagram').waitFor({state:'detached'})
      await page.getByRole('button',{name:'Natural',exact:true}).click()
      assert.equal(await page.locator('.preview-column .theme-natural').count(),1)
      await page.getByRole('button',{name:'2 tarjetas · 30 €',exact:true}).click()
      assert.match(await page.locator('.summary-total').textContent(),/30 €/)
      await page.getByRole('button',{name:'Probar demostración'}).click()
      await page.getByText('Perfil digital de Laura Martínez abierto.').waitFor()
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Populated overflow at ${width}`)
      assert.deepEqual(errors,[])
      await page.close(); console.log(`PASS: mobile composition, menu, compact/full preview, fields, theme, quantity and NFC at ${width}px`)
    }
    console.log(`Desktop: ${compared} existing reference screenshots verified. Capture references before edits with CAPTURE_BASELINE=1.`)
    const animated=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
    await animated.goto('http://127.0.0.1:5173');
    await animated.getByRole('button',{name:'Abrir menú',exact:true}).click();
    await animated.waitForFunction(()=>document.activeElement?.matches('#mobile-menu a:first-child'));
    await animated.keyboard.press('Escape'); await animated.locator('#mobile-menu').waitFor({state:'detached'});
    await animated.getByRole('button',{name:'Añadir información',exact:true}).click();
    await animated.locator('#field-menu').getByRole('button',{name:'Instagram',exact:true}).click();
    await animated.locator('#instagram').fill('https://instagram.com/'+'estudio'.repeat(50));
    assert.ok(await animated.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await animated.close(); console.log('PASS: mobile menu and expanding fields with motion enabled; other scenarios verified with reduced motion.')
  }
} finally { await browser.close() }
