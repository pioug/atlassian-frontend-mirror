// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import tasksAdf from './__fixtures__/basic-tasks-adf.json';

describe('tasks', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  it('should display tasks as action items', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: tasksAdf,
      viewport: { width: 1040, height: 400 },
    });
    await animationFrame(page);
    await snapshot(page);
  });
});
