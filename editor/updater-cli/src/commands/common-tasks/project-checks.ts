import { Task } from '../../runner';
import { resolveToCwd, exists } from '../../utils/fs';
import { loadPackageJson } from '../../utils/package-json';

export const projectChecksTask: Task = {
  title: "Checking project's compatibility",
  async task() {
    const yarnLockPath = resolveToCwd('yarn.lock');
    const packageJsonPath = resolveToCwd('package.json');
    const packageJsonLockPath = resolveToCwd('package-json.lock');

    if (!(await exists(packageJsonPath))) {
      throw new Error(
        'File "package.json" doesn\'t exist in current directory.',
      );
    }

    if (await exists(packageJsonLockPath)) {
      throw new Error(
        'File "package-json.lock" exists in current directory and npm is not supported yet.',
      );
    }

    if (!(await exists(yarnLockPath))) {
      throw new Error('File "yarn.lock" doesn\'t exist in current directory.');
    }

    const packageJson = await loadPackageJson(packageJsonPath);

    if (packageJson.bolt) {
      throw new Error('Bolt repositores is not yet supported.');
    }
  },
};
