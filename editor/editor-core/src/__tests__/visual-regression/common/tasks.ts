/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/task-with-status.adf.json';
import {
  toggleTaskNth,
  waitForTaskList,
  LIST_SELECTOR,
} from '@atlaskit/editor-test-helpers/page-objects/task';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

describe('Tasks', () => {
  it('Can check a task with status as the first element', async () => {
    const { page } = global;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await waitForTaskList(page);
    await toggleTaskNth(page, 1);
    await snapshot(page, undefined, LIST_SELECTOR);
  });
});
