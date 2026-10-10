#!/usr/bin/env node
// Hook post_tool_call do Hermes (matcher ^skill_manage$), gravado pelo link.mjs em cada perfil.
// Quando o Hermes cria ou apaga uma skill no repositório privado (skills.create_dir), refaz os
// links para os outros agentes. Não escreve nada na saída: o Hermes lê o stdout do hook como JSON.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { REPO, resolveAgents } from './lib.mjs';

let action = '';
try {
  action = JSON.parse(fs.readFileSync(0, 'utf8')).tool_input?.action || '';
} catch {}
if (['create', 'delete'].includes(action)) {
  // Sem o hermes: ele lê o repositório privado direto e a config dele já está certa.
  const agents = resolveAgents().filter((a) => a !== 'hermes');
  if (agents.length)
    spawnSync(process.execPath, [path.join(REPO, 'scripts', 'link.mjs'), '--yes', '--agents', agents.join(',')], { stdio: 'ignore' });
}
