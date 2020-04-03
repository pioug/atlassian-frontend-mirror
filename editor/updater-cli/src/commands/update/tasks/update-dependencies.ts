import { updatePackageJson } from '../../../utils/package-json';
import { yarn, deduplicate } from '../../../utils/yarn';
import { resolveToCwd } from '../../../utils/fs';
import { UpdateTask } from '../types';

export const updateDependenciesTask: UpdateTask = {
  title: 'Updating dependencies',
  async abort(_ctx, _params, task) {
    if (!(await task.prompt(`Continue updating?:`))) {
      task.abort();
      return true;
    }
    return false;
  },
  async task(ctx, _params, task) {
    const { packageJsonPatch, packageJsonPath, deps } = ctx;

    task.progress('updating package.json...');
    await updatePackageJson(packageJsonPath, packageJsonPatch);

    task.progress('running yarn...');
    await yarn();

    task.progress('deduplicating yarn.lock...');
    await deduplicate(
      resolveToCwd('yarn.lock'),
      deps.map(pkg => pkg.name),
    );
  },
};
