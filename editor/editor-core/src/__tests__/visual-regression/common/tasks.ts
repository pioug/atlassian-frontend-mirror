/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  LIST_SELECTOR,
  toggleTaskNth,
  waitForTaskList,
} from '@atlaskit/editor-test-helpers/page-objects/task';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

import adf from './__fixtures__/task-with-status.adf.json';
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
