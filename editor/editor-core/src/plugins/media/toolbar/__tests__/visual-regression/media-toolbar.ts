import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../../__tests__/visual-regression/_utils';
import { waitForMediaToBeLoaded } from '../../../../../__tests__/__helpers/page-objects/_media';
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
        allowMediaInline: true,
      },
    });
  };

  beforeEach(async () => {
    page = global.page;
    initEditor(mediaGroupAdf);
    await waitForMediaToBeLoaded(page);
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

  it('should open media viewer when preview button clicked', async () => {
    await page.click('[data-testid="file-preview-toolbar-button"]');
    await page.waitForSelector('[data-testid="media-viewer-error"]');
  });

  // FIXME: This test was automatically skipped due to failure on 8/30/2021: https://product-fabric.atlassian.net/browse/ED-13683
  it.skip('should show red border while hovering over the delete button', async () => {
    await page.hover('[data-testid="media-toolbar-remove-button"]');
    await waitForTooltip(page);
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
