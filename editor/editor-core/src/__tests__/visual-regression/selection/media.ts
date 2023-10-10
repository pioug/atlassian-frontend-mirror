// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mediaDangerSelector,
  mediaImageSelector,
  mediaToolbarRemoveSelector,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { flushPromises } from '@atlaskit/media-test-helpers';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

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
    });
  });
});
