// eslint-disable-next-line import/no-extraneous-dependencies
import { selectAtPos } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
  updateEditorProps,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

import kitchenSinkAdf from './__fixtures__/kitchen-sink-4.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Selection:', () => {
  let page: PuppeteerPage;

  describe('Disabled', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: kitchenSinkAdf,
        viewport: { width: 800, height: 320 },
      });
    });

    it('should be able to select text, when editor is disabled', async () => {
      await updateEditorProps(page, { disabled: true });

      await selectAtPos(page, 10, 50, false);

      await snapshot(page);
    });
  });
});
