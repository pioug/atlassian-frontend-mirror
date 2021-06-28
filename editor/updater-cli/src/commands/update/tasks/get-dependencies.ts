import chalk from 'chalk';
import {
  getFlatDependenciesList,
  DependenciesList,
  postProcessDependeciesList,
} from '../../../utils/npm';
import { UpdateTask } from '../types';

// Packages for which we don't allow automatic updates by default
const SKIP_AUTOMATIC_UPDATES = ['react', 'react-dom', 'styled-components'];

export const getDependenciesTask: UpdateTask = {
  title: (ctx) =>
    `Getting dependencies of ${chalk.yellow(
      '[' + Object.keys(ctx.packages).join(', ') + ']',
    )}`,
  async task(ctx, params, task) {
    const packages: DependenciesList = Object.entries(ctx.packages).map(
      (pkg) => ({
        name: pkg[0],
        version: pkg[1][1],
      }),
    );
    const skipAutomatic = SKIP_AUTOMATIC_UPDATES.filter(
      (pkg) => params.packages.indexOf(pkg) === -1,
    );
    const flatDeps = await getFlatDependenciesList(
      packages,
      [...(params.flags.exclude || []), ...skipAutomatic],
      0,
    );
    ctx.deps = postProcessDependeciesList([...packages, ...flatDeps]);
    return task.format(`Found: ${ctx.deps.length}`);
  },
};
