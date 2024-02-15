/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import mediaSingleVideoAdf from '../table/__fixtures__/mediasingle-video.adf.json';

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

  const makeSnapshot = async (page: PuppeteerPage) => {
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
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
    await makeSnapshot(page);
    await page.click('[data-testid="media-file-card-view"]');
    await waitForMediaFloatingToolbar(page);
    await makeSnapshot(page);

    let speedControlButtonSelector =
      '[data-testid="custom-media-player-playback-speed-toggle-button"]';
    await page.hover(speedControlButtonSelector);
    await makeSnapshot(page);

    // Wait a just a bit, to make sure following click won't be to fast
    await page.waitForTimeout(200);
    await page.click(speedControlButtonSelector);
    await makeSnapshot(page);
  });

  it('volume controls', async () => {
    await page.waitForSelector('[data-testid="media-file-card-view"]');
    await page.click('[data-testid="media-file-card-view"]');
    await waitForMediaFloatingToolbar(page);
    await page.click('[data-testid="media-card-inline-player"]');
    await page.hover(
      '[data-testid="custom-media-player-volume-toggle-button"]',
    );
    await makeSnapshot(page);
    await page.click(
      '[data-testid="custom-media-player-volume-toggle-button"]',
    );
    await makeSnapshot(page);
  });

  it('danger styles', async () => {
    await page.waitForSelector('[data-testid="media-file-card-view"]');
    await page.click('[data-testid="media-file-card-view"]');
    await waitForMediaFloatingToolbar(page);
    await page.hover('[data-testid="media-toolbar-remove-button"]');
    await makeSnapshot(page);
  });
});
