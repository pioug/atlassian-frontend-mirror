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

describe('Selection:', () => {
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
