import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'

// Accents, punctuation, prices and the copyright notice remain ordinary text.
// UI pictographs and decorative arrows must be SVG, never font glyphs.
test('React components contain no Unicode decorative icons or emoji', () => {
  for (const file of readdirSync('src', { recursive: true }) as string[]) {
    if (!file.endsWith('.tsx')) continue
    const source = readFileSync(`src/${file}`, 'utf8').replace(/[©®]/g, '')
    assert.doesNotMatch(source, /[\u2190-\u21ff\u2300-\u23ff\u25a0-\u27ff\u2b00-\u2bff\p{Extended_Pictographic}]/u, `${file}: use an SVG icon instead of a Unicode pictograph`)
  }
})

test('custom editorial star uses inherited SVG strokes', () => {
  const source = readFileSync('src/components/ui/EditorialStar.tsx', 'utf8')
  assert.match(source, /stroke="currentColor"/)
  assert.match(source, /fill="none"/)
  assert.match(source, /aria-hidden="true"/)
})
