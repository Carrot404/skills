import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { main } from '../../scripts/list-skills.mjs';

const temporaryDirectories = [];

async function createFixture(source) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'skills-list-test-'));
  temporaryDirectories.push(root);
  await mkdir(path.join(root, 'skills'));
  await writeFile(path.join(root, 'skills', '.gitkeep'), '');
  if (source !== undefined) {
    await mkdir(path.join(root, 'skills', 'alpha'));
    await writeFile(path.join(root, 'skills', 'alpha', 'SKILL.md'), source);
  }
  return root;
}

const validSkill = '---\nname: alpha\ndescription: Alpha skill\n---\n';

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(root => rm(root, { recursive: true, force: true })));
});

describe('list-skills', () => {
  it('accepts the empty repository without invoking the CLI', async () => {
    const root = await createFixture();
    const logger = { log: vi.fn() };
    const spawn = vi.fn();
    await main({ repoRoot: root, logger, spawn });
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('当前没有已发布的 Skill'));
    expect(spawn).not.toHaveBeenCalled();
  });

  it('runs real CLI discovery when a published Skill exists', async () => {
    const root = await createFixture(validSkill);
    await expect(main({ repoRoot: root })).resolves.toBeUndefined();
  });

  it('preserves CLI failures instead of treating them as an empty repository', async () => {
    const root = await createFixture(validSkill);
    for (const result of [{ status: 1 }, { status: null, signal: 'SIGTERM' }]) {
      const spawn = vi.fn().mockReturnValue(result);
      await expect(main({ repoRoot: root, spawn })).rejects.toThrow('Skill 发现检查失败');
      expect(spawn).toHaveBeenCalledWith(process.execPath, [
        expect.stringContaining('cli.mjs'), 'add', '.', '--list',
      ], { cwd: root, stdio: 'inherit' });
    }
    await expect(main({
      repoRoot: root,
      spawn: () => ({ error: new Error('spawn failed') }),
    })).rejects.toThrow('spawn failed');
  });

  it('rejects invalid frontmatter before invoking the CLI', async () => {
    const root = await createFixture('---\nname: alpha\n---\n');
    const spawn = vi.fn();
    await expect(main({ repoRoot: root, spawn })).rejects.toThrow('缺少 description');
    expect(spawn).not.toHaveBeenCalled();
  });

  it('uses repository defaults', async () => {
    await expect(main()).resolves.toBeUndefined();
  });
});
