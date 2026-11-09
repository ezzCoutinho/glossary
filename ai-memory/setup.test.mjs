import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('MCP e ponte usam a porta configurada, mantendo o padrão sem config', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'glossary-memory-'));
  const homedir = os.homedir;
  os.homedir = () => dir;
  try {
    const first = await import('./setup.mjs?default');
    assert.equal(first.MCP_URL, 'http://127.0.0.1:49374/mcp');
    assert.ok(first.paths.data.startsWith(dir + path.sep), 'dados do teste devem ficar na pasta temporária');
    fs.mkdirSync(first.paths.data, { recursive: true });
    const cases = [
      ['# bind = "127.0.0.1:49374"\nbind = "127.0.0.1:49375"\n[auth]\nbind = "ignored"', 'http://127.0.0.1:49375/mcp'],
      ["bind = '127.0.0.1:49376'", 'http://127.0.0.1:49376/mcp'],
      ['bind = "127.0.0.1:49375"\nserver_url = "http://localhost:49375/"', 'http://localhost:49375/mcp'],
    ];
    for (const [i, [config, url]] of cases.entries()) {
      fs.writeFileSync(path.join(first.paths.data, 'config.toml'), config);
      const setup = await import(`./setup.mjs?case=${i}`);
      assert.equal(setup.MCP_URL, url);
      assert.equal(setup.BRIDGE_ARGS.at(-1), url);
    }
  } finally {
    os.homedir = homedir;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
