import chalk from 'chalk';
import { Task } from '../../../runner';
import { getLatest } from '../../../utils/npm';
import { getPackageVersion, PackageJson } from '../../../utils/package-json';

export const getVersionsTask: Task<
  { packageJson: PackageJson; targetVersion: string; sourceVersion: string },
  { packageName: string }
> = {
  title: (_ctx, params) =>
    `Getting source and target versions of ${chalk.yellow(
      '[' + params.packageName + ']',
    )}`,
  task: async (ctx, params, task) => {
    task.progress(`determining the target version...`);
    const targetVersion = await getLatest(params.packageName);

    task.progress(`determining the source version...`);
    const currentVersion = getPackageVersion(
      ctx.packageJson,
      params.packageName,
    );

    if (!currentVersion) {
      throw new Error(
        `Package "${params.packageName}" is not listed in projects dependencies/devDependencies`,
      );
    }

    ctx.targetVersion = targetVersion;
    ctx.sourceVersion = currentVersion;

    return task.format([
      'Target: ' + targetVersion,
      'Source: ' + currentVersion,
    ]);
  },
};
