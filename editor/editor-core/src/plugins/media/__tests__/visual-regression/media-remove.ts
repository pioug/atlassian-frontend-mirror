import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import { waitForMediaToBeLoaded } from '../../../../__tests__/__helpers/page-objects/_media';
import * as mediaAdf from './__fixtures__/media.adf.json';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

async function initEditor(page: PuppeteerPage) {
  await initFullPageEditorWithAdf(
    page,
    mediaAdf,
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        allowMediaSingle: true,
      },
    },
  );

  await waitForMediaToBeLoaded(page);
}

describe('Snapshot Test: remove media', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when the remove button', () => {
    afterEach(async () => {
      await snapshot(page);
    });
    it('receives focus should highlight an element', async () => {
      await initEditor(page);
      await retryUntilStablePosition(
        page,
        async () => await page.click('[data-testid="media-file-card-view"]'),
        '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
        2000,
      );
      await page.focus('button[aria-label="Remove"]');
    });
    it('lost focus highlight should disappear', async () => {
      await initEditor(page);
      await retryUntilStablePosition(
        page,
        async () => await page.click('[data-testid="media-file-card-view"]'),
        '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
        2000,
      );
      await page.focus('button[aria-label="Remove"]');
      await page.$eval(
        'button[aria-label="Remove"]',
        (element) => element instanceof HTMLElement && element.blur(),
      );
    });
  });
});
