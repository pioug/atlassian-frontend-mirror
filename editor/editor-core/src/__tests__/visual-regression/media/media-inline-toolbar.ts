import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import mediaInlineAdf from './__fixtures__/mediaInline.adf.json';

describe('Media Inline Toolbar:', () => {
  let page: PuppeteerPage;

  const mediaInlineLoadedViewSelector =
    '[data-testid="media-inline-card-loaded-view"]';

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

    await page.waitForSelector(mediaInlineLoadedViewSelector, {
      visible: true,
    });
  };

  beforeEach(async () => {
    page = global.page;
    await initEditor(mediaInlineAdf);
    await page.click(mediaInlineLoadedViewSelector);
    await page.mouse.move(0, 0);
  });

  afterEach(async () => {
    await snapshot(page);
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

  it.skip('should open media viewer when preview button clicked', async () => {
    await page.click('[data-testid="file-preview-toolbar-button"]');
    await page.waitForSelector('[data-testid="media-viewer-error"]');
  });

  it('should show red border while hovering over the delete button', async () => {
    await page.hover('[data-testid="media-toolbar-remove-button"]');
  });
});
