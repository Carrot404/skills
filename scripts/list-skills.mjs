#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPublishedSkillNames } from './generate-skill-groups.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const defaultRepoRoot = path.resolve(path.dirname(scriptPath), '..');

export async function main(options = {}) {
  const repoRoot = options.repoRoot ?? defaultRepoRoot;
  const names = await readPublishedSkillNames(repoRoot);
  if (names.length === 0) {
    (options.logger ?? console).log('当前没有已发布的 Skill，请在 skills/<skill-name>/SKILL.md 中添加。');
    return;
  }

  const run = options.spawn ?? spawnSync;
  const result = run(process.execPath, [
    fileURLToPath(import.meta.resolve('skills/bin/cli.mjs')),
    'add', '.', '--list',
  ], { cwd: repoRoot, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Skill 发现检查失败：${result.signal ?? result.status}`);
  }
}

/* v8 ignore start -- CLI bootstrap is covered through exported main() */
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
/* v8 ignore stop */
