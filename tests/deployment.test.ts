import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

test('deployment guard rejects the source HTML that caused the live blank screen', () => {
  const folder = mkdtempSync(join(tmpdir(), 'tapmola-deploy-'))
  try {
    writeFileSync(join(folder, 'index.html'), '<div id="root"></div><script type="module" src="/src/main.tsx"></script>')
    const result = spawnSync(process.execPath, ['scripts/check-dist.mjs', folder], { encoding: 'utf8' })
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /HTML fuente/)
  } finally { rmSync(folder, { recursive: true, force: true }) }
})
