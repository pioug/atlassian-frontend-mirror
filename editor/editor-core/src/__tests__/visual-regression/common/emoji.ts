// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

import emojiAdf from './__fixtures__/emoji-adf.json';

describe('Emoji', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  describe('when clicked on', () => {
    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: emojiAdf,
        viewport: { width: 300, height: 150 },
      });
      // Wait for loaded emoji image (contained within ADF)
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });

    afterEach(async () => {
      // move mouse as the cursor overlay covers emoji so makes it hard to see selection
      await page.mouse.move(0, 0);
      // FIXME These tests were flakey in the Puppeteer v10 Upgrade
      await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.05 });
    });

    it('displays standard emoji as selected', async () => {
      await page.click(emojiSelectors.standard);
    });

    it('displays custom emoji as selected', async () => {
      await page.click(emojiSelectors.custom);
    });
  });
});
