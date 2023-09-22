import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { resetMousePosition } from '@atlaskit/editor-test-helpers/page-objects/mouse';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
import mediaGroupAdf from './__fixtures__/mediaGroup.adf.json';
import mediaGroupMultiFilesAdf from './__fixtures__/mediaGroupMultiFiles.adf.json';

describe('Media Toolbar:', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    adf: any,
    viewport: { width: number; height: number } = {
      width: 1280,
      height: 720,
    },
  ) => {
    await initFullPageEditorWithAdf(page, adf, undefined, viewport, {
      media: {
        allowMediaGroup: true,
        featureFlags: {
          mediaInline: true,
        },
      },
    });
  };

  beforeEach(async () => {
    page = global.page;
    initEditor(mediaGroupAdf);
    await waitForMediaToBeLoaded(page);
    await resetMousePosition(page);
    await animationFrame(page);
    await animationFrame(page);
  });

  afterEach(async () => {
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
  });

  it('should display buttons in the correct order', async () => {
    await page.waitForSelector('[aria-label="Media floating controls"]');
  });

  it('should display view switcher dropdown correctly', async () => {
    await page.click('span[aria-label="Expand dropdown menu"]');
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
  });

  // TODO: Media team to fix this broken test
  it.skip('should open media viewer when preview button clicked', async () => {
    await page.click('[data-testid="file-preview-toolbar-button"]');
    await page.waitForSelector('[data-testid="media-viewer-error"]');
  });

  it('should show red border while hovering over the delete button', async () => {
    await page.hover('[data-testid="media-toolbar-remove-button"]');
    await animationFrame(page);
    await animationFrame(page);
  });

  it('should display buttons in the correct order with multiple files in media group', async () => {
    await page.mouse.move(0, 0);
    initEditor(mediaGroupMultiFilesAdf);
    await waitForMediaToBeLoaded(page);
    let mediaCards = await page.$$('[data-testid="media-card-view"]');
    await mediaCards[1].click();
    await page.waitForSelector('[aria-label="Media floating controls"]');
  });
});
