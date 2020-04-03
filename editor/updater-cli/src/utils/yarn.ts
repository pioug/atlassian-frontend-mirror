import { exec } from 'child_process';
import { promisify } from 'util';
import { fixDuplicates } from 'yarn-deduplicate';
import { readFile, writeFile, resolveToCwd } from './fs';

const pexec = promisify(exec);

export function yarn() {
  return pexec('yarn');
}

export async function loadYarnLock(yarnLockPath: string) {
  return await readFile(yarnLockPath, 'utf8');
}

export async function deduplicate(
  yarnLockPath: string,
  packages: Array<string>,
) {
  const yarnLock = await loadYarnLock(yarnLockPath);
  const dedupedYarnLock = fixDuplicates(yarnLock, {
    includePackages: packages,
  });
  await writeFile(yarnLockPath, dedupedYarnLock);
  await pexec(`rm -rf ${resolveToCwd('node_modules')}`);
  await pexec('yarn');
}
