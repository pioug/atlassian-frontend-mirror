// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

import adf from './__fixtures__/nested-actions.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Nested actions', () => {
  it('looks correct', async () => {
    const { page } = global;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
      editorProps: {
        allowNestedTasks: true,
      },
    });
    await page.waitForSelector(selectors.actionList);
    await snapshot(page);
  });
});
