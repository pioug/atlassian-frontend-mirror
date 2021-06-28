import chalk from 'chalk';
import { diff, coerce } from 'semver';
import { PrintableOutput, TaskWrapper } from '../../../runner';
import { getChangelog, getLogDetails } from '../../../utils/changelog';
import { badgeRed } from '../../../utils/console';
import { UpdateTask } from '../types';
import { PackageJsonPatchGroup } from '../../../utils/package-json';

async function printDeps(
  title: string,
  deps: PackageJsonPatchGroup,
  task: TaskWrapper,
) {
  if (!Object.keys(deps).length) {
    return [];
  }

  const dependencies = Object.entries(deps);

  let listWithBreaking: PrintableOutput = [];
  let listWithoutBreaking: PrintableOutput = [];
  for (let i = 0; i < dependencies.length; i++) {
    const [name, versions]: [string, any] = dependencies[i];
    const isMajor =
      diff(coerce(versions[0])!.version, coerce(versions[1])!.version) ===
      'major';

    const depTitle = `${name}: ${chalk.blue(versions[0])} → ${
      isMajor ? badgeRed(versions[1]) : chalk.blue(versions[1])
    }`;
    let listItem: PrintableOutput = [
      isMajor ? `${depTitle} ${chalk.red('[breaking changes]')}` : depTitle,
    ];

    if (isMajor) {
      const logs = await getChangelog(name, versions[1]);
      const { majorChanges } = await getLogDetails(logs, versions[0]);
      listItem = listItem.concat(
        task.format(majorChanges, (item) => chalk.dim(item)),
        '',
      );
      listWithBreaking = listWithBreaking.concat(listItem);
    } else {
      listWithoutBreaking = listWithoutBreaking.concat(listItem);
    }
  }

  return [title, listWithBreaking, listWithoutBreaking];
}

export const showDependenciesListTask: UpdateTask = {
  title: 'Preparing list of the dependencies',
  async task(ctx, _params, task) {
    const list = await Promise.all([
      printDeps(
        chalk.yellow('Dependencies:'),
        ctx.packageJsonPatch.dependencies,
        task,
      ),
      printDeps(
        chalk.yellow('DevDependencies:'),
        ctx.packageJsonPatch.devDependencies,
        task,
      ),
    ]);

    task.title = 'Updating following dependencies:';
    let changelogs = list.reduce((acc, item) => [...acc, ...item], []);
    ctx.changelogs = changelogs;
    return changelogs;
  },
};
