import { coerce, eq, diff } from 'semver';
import chalk from 'chalk';
import { UpdateTask } from '../types';
import { PackageJsonPatchGroup } from '../../../utils/package-json';
import { PrintableOutput } from '../../../runner';
import { badgeRed } from '../../../utils/console';

export const compareVersionsTask: UpdateTask = {
  title: (ctx) =>
    `Comparing versions of: ${chalk.yellow(
      '[' + Object.keys(ctx.packages).join(', ') + ']',
    )}`,
  async skip(_ctx, params) {
    return !!params.flags.force;
  },
  async task(ctx, params, task) {
    const output: PrintableOutput = [];
    const packages = Object.entries(ctx.packages).reduce<PackageJsonPatchGroup>(
      (acc, pkg) => {
        if (!eq(coerce(pkg[1][0])!, coerce(pkg[1][1])!) || params.flags.force) {
          acc[pkg[0]] = pkg[1];
          const isMajor =
            diff(coerce(pkg[1][0])!.version, coerce(pkg[1][1])!.version) ===
            'major';
          output.push(
            `→ ${pkg[0]}: ${chalk.blue(pkg[1][0])} → ${(isMajor
              ? badgeRed
              : chalk.blue)(pkg[1][1])}`,
          );
        } else {
          output.push(chalk.dim(`→ ${pkg[0]}: ${pkg[1][0]} === ${pkg[1][1]}`));
        }

        return acc;
      },
      {},
    );

    ctx.packages = packages;

    if (!Object.keys(packages).length) {
      task.abort();
      return task.format(
        `Packages [${Object.entries(ctx.packages)
          .map((p) => p[0])
          .join(', ')}] are up-to-date. Use --force to force update.`,
      );
    }

    return output;
  },
};
