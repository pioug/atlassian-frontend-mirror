import chalk from 'chalk';
import { Task, PrintableOutput } from '../../../runner';
import { getLatest } from '../../../utils/npm';
import {
  getPackageVersion,
  PackageJson,
  PackageJsonPatchGroup,
} from '../../../utils/package-json';
import { updateVersionRange } from '../../../utils/semver';

export const getVersionsTask: Task<
  { packageJson: PackageJson; packages: PackageJsonPatchGroup },
  { packages: Array<string> }
> = {
  title: (_ctx, params) =>
    `Getting source and target versions of ${chalk.yellow(
      '[' + params.packages.join(', ') + ']',
    )}`,
  task: async (ctx, params, task) => {
    const output: PrintableOutput = [];
    const ignoredOutput: Array<string> = [];
    const packages: PackageJsonPatchGroup = {};
    for (const pkg of params.packages) {
      task.progress(`${pkg}...`);
      const sourceVersion = getPackageVersion(ctx.packageJson, pkg);
      const targetVersion =
        sourceVersion &&
        updateVersionRange(sourceVersion, await getLatest(pkg));
      if (sourceVersion && targetVersion) {
        packages[pkg] = [sourceVersion, targetVersion];
        output.push(
          pkg,
          task.format(['Target: ' + targetVersion, 'Source: ' + sourceVersion]),
        );
      } else {
        ignoredOutput.push(
          chalk.yellow.dim(
            `[ignored] ${pkg} is not listed in project's dependencies/devDependencies`,
          ),
        );
      }
    }

    if (!Object.keys(packages).length) {
      task.abort();
      return task.format([
        "None of the provided packages is listed in project's dependencies/devDependencies",
      ]);
    }

    ctx.packages = packages;

    return [...output, ...ignoredOutput];
  },
};
