import chalk from 'chalk';
import { satisfies } from 'semver';
import { getChangelog, getLogDetails, Log } from '../../../utils/changelog';
import { ChangeLogTasks } from '../types';
import { PrintableOutput } from '../../../runner';

export function getUpdated(logs: Log[], currentVersion: string): string[] {
  return Array.from(
    new Set(
      logs
        .filter(
          log =>
            satisfies(log.version, `>${currentVersion}`) && log.updated.length,
        )
        .reduce((acc, cur) => {
          acc = acc.concat(cur.updated);
          return acc;
        }, [] as string[]),
    ).values(),
  ) as string[];
}

export const showChangelogTask: ChangeLogTasks = {
  title: 'Getting changelog...',
  async task(ctx, params) {
    const sourceVersion = params.currentVersion || ctx.sourceVersion;
    const logs = await getChangelog(params.packageName, ctx.targetVersion);
    const updated = getUpdated(logs, sourceVersion);
    const { majorChanges, minorChanges, patchChanges } = getLogDetails(
      logs,
      sourceVersion,
    );

    const output: PrintableOutput = [];
    if (majorChanges.length) {
      output.push(
        chalk.bold(chalk.yellow('💥 Breaking Changes (major)')),
        majorChanges,
        '',
      );
    }
    if (minorChanges.length) {
      output.push(
        chalk.bold(chalk.yellow('🚀 New Features (minor)')),
        minorChanges,
        '',
      );
    }
    if (patchChanges.length) {
      output.push(
        chalk.bold(chalk.yellow('🐛 Bug Fixes (patch)')),
        patchChanges,
        '',
      );
    }

    const noChanges =
      !majorChanges.length && !minorChanges.length && !patchChanges.length;
    if (noChanges && !updated.length) {
      return `🧐 Looks like nothing changed! You're probably already on ${ctx.targetVersion} of "${params.packageName}".`;
    } else if (noChanges && updated.length) {
      return [
        `👍 No changes were made in "${params.packageName}" between ${sourceVersion} and ${ctx.targetVersion}. It has been bumped due to changes made in the following packages:`,
        updated.map((pkg: string) => chalk.bold(`  - ${pkg}`)),
      ];
    }

    return output;
  },
};
