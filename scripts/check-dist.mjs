import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.argv[2] || 'dist')
const base = new URL('https://tapmola.github.io/Info/')
const html = readFileSync(resolve(root, 'index.html'), 'utf8')
assert.ok(html.includes('id="root"'), 'Falta el punto de montaje de React')
assert.doesNotMatch(html, /(?:\/src\/|\.tsx["'])/, 'Se ha seleccionado el HTML fuente en lugar del build de Vite')

function localAsset(reference, relativeTo = base) {
  const url = new URL(reference, relativeTo)
  assert.equal(url.origin, base.origin, `Recurso externo inesperado: ${url}`)
  assert.ok(url.pathname.startsWith(base.pathname), `Recurso fuera de /Info/: ${url}`)
  const path = resolve(root, decodeURIComponent(url.pathname.slice(base.pathname.length)))
  assert.ok(path.startsWith(root + '/'), `Recurso fuera de dist: ${path}`)
  assert.ok(statSync(path).isFile(), `Recurso no encontrado: ${path}`)
  return { path, url }
}
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1])
const styles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1])
assert.ok(scripts.length > 0 && styles.length > 0, 'El HTML no carga JavaScript y CSS compilados')
for (const script of scripts) {
  assert.match(script, /\/assets\/.+\.js$/, 'La entrada debe ser un módulo compilado de assets/')
  localAsset(script)
}
for (const stylesheet of styles) {
  const { path, url } = localAsset(stylesheet)
  for (const match of readFileSync(path, 'utf8').matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)) {
    const reference = (match[1] ?? match[2] ?? match[3]).trim()
    if (!reference.startsWith('data:')) localAsset(reference, url)
  }
}
localAsset('favicon.svg')
localAsset('social-preview.png')
console.log('PASS: dist contiene HTML compilado, módulos, CSS, fuentes e imágenes válidos bajo /Info/.')
