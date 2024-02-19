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

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('tasks', () => {
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
