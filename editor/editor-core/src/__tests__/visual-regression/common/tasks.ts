import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/task-with-status.adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import {
  toggleTaskNth,
  waitForTaskList,
  LIST_SELECTOR,
} from '../../__helpers/page-objects/_task';

describe('Tasks', () => {
  it('Can check a task with status as the first element', async () => {
    const page: Page = global.page;
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
