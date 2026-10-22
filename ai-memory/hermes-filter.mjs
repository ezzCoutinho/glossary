#!/usr/bin/env node
// Fica na frente dos hooks do ai-memory no Hermes: node hermes-filter.mjs <comando do ai-memory...>.
// Subagentes do Hermes mandam session_id vazio; o servidor recusa, o evento fica na fila
// (hook-spool) e o lote para nele, travando a captura de todos os agentes. Esses eventos são
// descartados aqui; o resto segue para o comando com o mesmo stdin e stdout.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const input = fs.readFileSync(0);
let session = 'unparsed';
try {
  session = JSON.parse(input).session_id;
} catch {}
if (session) {
  const [cmd, ...args] = process.argv.slice(2);
  process.exitCode = spawnSync(cmd, args, { input, stdio: ['pipe', 'inherit', 'inherit'] }).status ?? 1;
}
