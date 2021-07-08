import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { waitForMediaToBeLoaded } from '../../__helpers/page-objects/_media';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import mediaSingleVideoAdf from '../table/__fixtures__/mediasingle-video.adf.json';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';

describe('Snapshot Test: Media inline video player', () => {
  let page: PuppeteerPage;

  const waitForMediaFloatingToolbar = async (page: PuppeteerPage) => {
    await retryUntilStablePosition(
      page,
      async () => await page.click('[data-testid="media-card-inline-player"]'),
      '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
      2000,
    );
  };

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: mediaSingleVideoAdf,
      editorProps: {
        media: {
          allowMediaSingle: true,
          allowResizing: true,
        },
      },
    });

    await waitForMediaToBeLoaded(page);
  });

  it('should render inline video player', async () => {
    await page.waitForSelector('[data-testid="media-file-card-view"]');
    await snapshot(page);
    await page.click('[data-testid="media-file-card-view"]');
    await waitForMediaFloatingToolbar(page);
    await snapshot(page);
    await page.click(
      '[data-testid="custom-media-player-playback-speed-toggle-button"]',
    );
    await waitForTooltip(page);
    await snapshot(page);
  });

  it('volume controls', async () => {
    await page.waitForSelector('[data-testid="media-file-card-view"]');
    await page.click('[data-testid="media-file-card-view"]');
    await waitForMediaFloatingToolbar(page);
    await page.click('[data-testid="media-card-inline-player"]');
    await page.hover(
      '[data-testid="custom-media-player-volume-toggle-button"]',
    );
    await snapshot(page);
    await page.click(
      '[data-testid="custom-media-player-volume-toggle-button"]',
    );
    await snapshot(page);
  });
  // FIXME: flakey test
  it.skip('danger styles', async () => {
    await page.waitForSelector('[data-testid="media-file-card-view"]');
    await page.click('[data-testid="media-file-card-view"]');
    await waitForMediaFloatingToolbar(page);
    await page.hover('[data-testid="media-toolbar-remove-button"]');
    await waitForTooltip(page);
    await snapshot(page);
  });
});
