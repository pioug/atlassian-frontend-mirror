import { UpdateTask } from '../types';
import { resolveToCwd } from '../../../utils/fs';
import * as git from '../../../utils/git';

export const commitChangedTask: UpdateTask = {
  title: 'Committing changes',
  async task(ctx) {
    await git.add(resolveToCwd('package.json'));
    await git.add(resolveToCwd('yarn.lock'));
    await git.commit(
      `Updated packages [${Object.keys(ctx.packages).join(', ')}]`,
      ctx.changelogs,
    );
  },
};
