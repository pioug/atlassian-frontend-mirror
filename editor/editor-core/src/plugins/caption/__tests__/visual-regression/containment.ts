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
import captionWrappedTable from './__fixtures__/caption-wrapped-table.adf.json';
import captionWrappedSkinnyTable from './__fixtures__/caption-wrapped-skinny-table.adf.json';
import captionWrappedLayout from './__fixtures__/caption-wrapped-layout.adf.json';
import captionWrappedExpand from './__fixtures__/caption-wrapped-expand.adf.json';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

async function initEditor(page: PuppeteerPage, adf: object) {
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

  describe('containment', () => {
    describe('when caption feature flag is enabled', () => {
      afterEach(async () => {
        await snapshot(page);
      });

      it('should show the caption in a table', async () => {
        await initEditor(page, captionWrappedTable);
      });

      it('should show the caption in a skinny table', async () => {
        await initEditor(page, captionWrappedSkinnyTable);
      });

      it('should show the caption in a layout', async () => {
        await initEditor(page, captionWrappedLayout);
      });

      it('should show the caption in an expand', async () => {
        await initEditor(page, captionWrappedExpand);
      });
    });
  });
});
