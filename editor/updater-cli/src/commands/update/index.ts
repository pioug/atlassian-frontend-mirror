import { createCommand } from '../../runner';
import { loadPackageJsonTask } from '../common-tasks/load-package-json';
import { applyPreset } from './apply-preset';
import { getVersionsTask } from './tasks/get-versions';
import { compareVersionsTask } from './tasks/compare-version';
import { getDependenciesTask } from './tasks/get-dependencies';
import { getCommonDependenciesTask } from './tasks/get-common-dependencies';
import { showDependenciesListTask } from './tasks/show-dependencies-list';
import { updateDependenciesTask } from './tasks/update-dependencies';
import { UpdateTaskParams, UpdateTaskCtx, UpdateTaskFlags } from './types';
import { projectChecksTask } from '../common-tasks/project-checks';
import { commitChangedTask } from './tasks/commit-changes';

const updateTasks = createCommand<UpdateTaskCtx, UpdateTaskParams>([
  projectChecksTask,
  loadPackageJsonTask,
  getVersionsTask,
  compareVersionsTask,
  getDependenciesTask,
  getCommonDependenciesTask,
  showDependenciesListTask,
  updateDependenciesTask,
  commitChangedTask,
]);

export async function updateCommand(
  packages: Array<string>,
  flags: UpdateTaskFlags,
) {
  return updateTasks({
    packages: packages.concat(applyPreset(flags.preset)),
    flags,
  });
}
