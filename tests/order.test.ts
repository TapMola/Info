import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyCard } from '../src/types/card.ts'
import { orderBody, orderUrls, safeUrl, vCard } from '../src/lib/order.ts'
test('order preserves accented names, custom links, quantity, price and manual attachment notice', () => {
  const card = { ...emptyCard, name: 'Inés & Núñez', email: 'ines+trabajo@example.com', quantity: 2 as const, theme: 'contrast' as const, logoName: 'mi logo.png', links: [{ id: '1', label: 'Portfolio', url: 'https://example.com/?a=1&b=2' }] }
  const body = orderBody(card)
  assert.match(body, /Total: 30 €/); assert.match(body, /Diseño digital: Contraste/); assert.match(body, /adjuntar el archivo manualmente/)
  assert.match(body, /Portfolio: https:\/\/example.com\/\?a=1&b=2/)
  const gmail = new URL(orderUrls(card).gmail)
  assert.equal(gmail.searchParams.get('body'), body); assert.equal(gmail.searchParams.get('to'), 'tapmolanfc@gmail.com')
  const mailto = new URL(orderUrls(card).mailto)
  assert.equal(mailto.searchParams.get('body'), body); assert.match(mailto.searchParams.get('subject')!, /Inés & Núñez/)
})
test('single card has the original 25 euro price', () => assert.match(orderBody(emptyCard), /Total: 25 €/))
test('preview rejects executable links and accepts web links', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///tmp/test', 'not a url']) assert.equal(safeUrl(url), undefined)
  assert.equal(safeUrl('https://example.com/a?b=2'), 'https://example.com/a?b=2')
})
test('vCard escapes values to prevent injected fields', () => {
  const result = vCard({ ...emptyCard, name: 'Ana\nTEL:123', business: 'Diseño, arte; Madrid' })
  assert.match(result, /FN:Ana\\nTEL:123\r\n/); assert.match(result, /ORG:Diseño\\, arte\\; Madrid/)
  assert.ok(!result.includes('\nTEL:123\r\n'))
})
