import {
  PuppeteerPage,
  waitForTooltip,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { flushPromises } from '@atlaskit/media-test-helpers';

import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  waitForMediaToBeLoaded,
  mediaImageSelector,
  mediaToolbarRemoveSelector,
  mediaDangerSelector,
} from '@atlaskit/editor-test-helpers/page-objects/media';

import adf from './__fixtures__/nested-elements.adf.json';

describe('Selection:', () => {
  let page: PuppeteerPage;

  describe('Media', () => {
    const cardProvider = new EditorTestCardProvider();

    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        viewport: { width: 1280, height: 550 },
        editorProps: {
          smartLinks: { provider: Promise.resolve(cardProvider) },
        },
      });

      await waitForMediaToBeLoaded(page);
      await waitForLoadedImageElements(page, 3000);
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('displays danger styling when selected and hovering over delete button', async () => {
      await page.click(mediaImageSelector);

      // Wait for a frame because we are using RAF to throttle floating toolbar render
      await animationFrame(page);

      // Media toolbar link button is async, so wait for all existing promises to flush
      await flushPromises();

      await page.waitForSelector(mediaToolbarRemoveSelector);
      await page.hover(mediaToolbarRemoveSelector);
      await page.waitForSelector(mediaDangerSelector);
      await waitForTooltip(page);
    });
  });
});
