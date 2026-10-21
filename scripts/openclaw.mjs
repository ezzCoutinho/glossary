// Integração nativa do OpenClaw; as escritas passam pelo CLI para preservar a config.
import fs from 'node:fs';
import path from 'node:path';
import { backupFile, expandHome, log, readJSON, runQuiet, which } from './lib.mjs';

export const OPENCLAW_HOME = path.resolve(expandHome(process.env.OPENCLAW_STATE_DIR || '~/.openclaw'));
export const OPENCLAW_CONFIG = expandHome(process.env.OPENCLAW_CONFIG_PATH || path.join(OPENCLAW_HOME, 'openclaw.json'));

export const openclawConfig = () => readJSON(OPENCLAW_CONFIG, {});

export function openclawHooksWired() {
  const config = openclawConfig();
  if (config.plugins?.enabled === false || config.plugins?.entries?.['ai-memory']?.enabled !== true) return false;
  if (config.plugins.entries['ai-memory'].hooks?.allowConversationAccess !== true) return false;
  if (config.plugins?.allow && !config.plugins.allow.includes('ai-memory')) return false;
  return (config.plugins?.load?.paths || []).some((dir) => {
    const root = expandHome(dir);
    return readJSON(path.join(root, 'openclaw.plugin.json'), {}).id === 'ai-memory'
      && fs.existsSync(path.join(root, 'index.ts'));
  });
}

export function allowOpenclawCapture({ dryRun = false } = {}) {
  if (openclawConfig().plugins?.entries?.['ai-memory']?.hooks?.allowConversationAccess === true) return;
  const cli = which('openclaw');
  if (!cli) throw new Error('OpenClaw não está no PATH');
  backupFile(OPENCLAW_CONFIG, { dryRun });
  if (runQuiet(cli, ['config', 'set', 'plugins.entries.ai-memory.hooks.allowConversationAccess', 'true'], { dryRun }) !== 0)
    throw new Error('OpenClaw: falha ao autorizar os hooks de captura do ai-memory');
}

export function openclawWorkspaces() {
  const agents = openclawConfig().agents || {};
  const fallback = agents.defaults?.workspace || path.join(OPENCLAW_HOME, 'workspace');
  const entries = agents.entries || Object.fromEntries((agents.list || []).map((a) => [a.id, a]));
  const workspaces = Object.values(entries).map((a) => a.workspace || fallback);
  return [...new Set((workspaces.length ? workspaces : [fallback]).map((p) => path.resolve(expandHome(p))))];
}

export function wireOpenclawMcp(name, entry, { dryRun = false, remove = false } = {}) {
  const current = openclawConfig().mcp?.servers?.[name];
  if (remove ? !current : JSON.stringify(current) === JSON.stringify(entry)) {
    log.ok(`openclaw: ${name} já ${remove ? 'removido' : 'registrado'}`);
    return;
  }
  const cli = which('openclaw');
  if (!cli) throw new Error('OpenClaw não está no PATH');
  backupFile(OPENCLAW_CONFIG, { dryRun });
  const args = remove ? ['mcp', 'unset', name] : ['mcp', 'set', name, JSON.stringify(entry)];
  if (runQuiet(cli, args, { dryRun }) !== 0) throw new Error(`OpenClaw: falha ao configurar ${name}`);
}
