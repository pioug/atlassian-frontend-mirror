import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import {
  clickMediaInPosition,
  waitForMediaToBeLoaded,
} from '../../../../__tests__/__helpers/page-objects/_media';
import mediaWithCaption from './__fixtures__/media-with-caption.adf.json';
import mediaWithCaptionWrapRight from './__fixtures__/media-with-caption-wrap-right.adf.json';
import mediaWithCaptionWrapLeft from './__fixtures__/media-with-caption-wrap-left.adf.json';
import mediaWithCaptionAlignStart from './__fixtures__/media-with-caption-align-start.adf.json';
import mediaWithCaptionAlignEnd from './__fixtures__/media-with-caption-align-end.adf.json';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {
    media: {
      allowMediaSingle: true,
      featureFlags: {
        captions: true,
      },
    },
  });

  await waitForMediaToBeLoaded(page);

  await retryUntilStablePosition(
    page,
    () => clickMediaInPosition(page, 0), // this is the operation you want to perform, which also makes the floating toolbar visible. Usually a page.click()
    '[aria-label*="Media floating controls"]', // this is the toolbar (or any other) selector whose position you want settled before continuing
    1000, // this is the duration between the periodic positioning checks - I recommend trying with 1000ms first.
  );
}

describe('Snapshot Test: Caption with media', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('alignment', () => {
    describe('when caption feature flag is enabled', () => {
      afterEach(async () => {
        await snapshot(page);
      });

      it('show the caption with center alignment', async () => {
        await initEditor(page, mediaWithCaption);
      });

      it('show the caption with wrapped right alignment', async () => {
        await initEditor(page, mediaWithCaptionWrapRight);
      });

      it('show the caption with wrapped left alignment', async () => {
        await initEditor(page, mediaWithCaptionWrapLeft);
      });

      it('show the caption with align start alignment', async () => {
        await initEditor(page, mediaWithCaptionAlignStart);
      });

      // FIXME: This test was automatically skipped due to failure on 8/26/2021: https://product-fabric.atlassian.net/browse/ED-13678
      it.skip('show the caption with align end alignment', async () => {
        await initEditor(page, mediaWithCaptionAlignEnd);
      });
    });
  });
});
