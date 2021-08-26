import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import { uploadMedia } from '../../_utils/afe-app-helpers';
import mediaSingleAdf from '../../__fixtures__/media-single.adf.json';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/lib/appium/keyboard/common-osk';
import media2ColumnLayoutAdf from '../../__fixtures__/media-2-column-layout.adf.json';
import media3ColumnLayoutAdf from '../../__fixtures__/media-3-column-layout.adf.json';
import mediaGroupAdf from '../../__fixtures__/media-group.adf.json';
import mediaImageTableAdf from '../../__fixtures__/media-image-table.adf.json';
import mediaSingleVideoFailedProcessingAdf from '../../__fixtures__/media-single-video-failed-processing.adf.json';
import mediaSingleEmptyFileAdf from '../../__fixtures__/media-single-empty-file.adf.json';
import { focusOnWebView } from '../../_page-objects/hybrid-editor-page';
import mediaExpandAdf from '../../__fixtures__/media-expand.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';
import {
  waitForAtLeastNumFileCards,
  resizeMediaSingle,
  mediaCardSelector,
} from '../../_utils/media';

export default async () => {
  MobileTestCase(
    'Media: user can remove mediaSingle node',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, mediaSingleAdf);
      const media = await page.$(mediaCardSelector());
      await media.waitForDisplayed();

      // For reasons that are beyond my knowledge,
      // IOS requires a double-tap to delete the media.
      // However, this behavior doesn't happen in a simulator or real device.
      if (page.isIOS()) {
        await page.tapKeys(SPECIAL_KEYS.DELETE);
      }
      // Delete MediaSingle
      await page.tapKeys(SPECIAL_KEYS.DELETE);
      await page.switchToWeb();
      const mediaSingleExists = await page.isExisting(mediaCardSelector());
      // Ensure MediaSingle is deleted
      expect(mediaSingleExists).toBeFalsy();
    },
  );

  MobileTestCase('Media: Upload media', {}, async (client) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.switchToWeb();
    await uploadMedia(page);
    await page.waitForSelector(mediaCardSelector());
  });

  MobileTestCase(
    'Media in Layouts: 2 column',
    { skipPlatform: ['android'] },
    async (client) => {
      const page = await Page.create(client);

      await loadEditor(page);
      await page.switchToWeb();
      await setADFContent(page, media2ColumnLayoutAdf);
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
      const layout = await page.$('[data-layout-section="true"]');
      await layout.scrollIntoView();
      await mobileSnapshot(page);
    },
  );

  MobileTestCase('Media in Layouts: 3 columns', {}, async (client) => {
    const page = await Page.create(client);

    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, media3ColumnLayoutAdf);
    await page.waitForSelector(mediaCardSelector());
    const layout = await page.$('[data-layout-section="true"]');
    await layout.scrollIntoView();
    await mobileSnapshot(page);
  });

  MobileTestCase('Media: Load and delete MediaGroup', {}, async (client) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, mediaGroupAdf);
    await page.waitForSelector('[data-testid="media-filmstrip"]');
    await page.waitForSelector(mediaCardSelector());
    const filmstrip = await page.$('[data-testid="media-filmstrip"]');
    await filmstrip.scrollIntoView();
    // On IOS MediaGroup is not focused by default, so we need to focus it manually
    if (page.isIOS()) {
      await page.switchToWeb();
      const card = await page.$(mediaCardSelector());
      await card.click();
    }
    await mobileSnapshot(page);
    // ensure card is selected
    await page.switchToWeb();
    await page.waitForSelector(
      '[data-testid="media-file-card-view"][data-test-status="complete"][data-test-selected="true"]',
    );
    // Delete media group
    await page.click(
      '[data-testid="media-file-card-view"] [data-testid="media-card-primary-action"]',
    );

    const mediaGroupExists = await page.isExisting(
      '[data-testid="media-filmstrip"]',
    );
    // Ensure MediaGroup is deleted
    expect(mediaGroupExists).toBeFalsy();
  });

  MobileTestCase(
    'Media inside expand',
    { skipPlatform: ['android', 'ios'] },
    async (client) => {
      const page = await Page.create(client);

      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaExpandAdf);
      await page.waitForSelector(mediaCardSelector());
      await focusOnWebView(page);
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Load ADF with a MediaSingle node',
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaSingleAdf);
      await page.waitForSelector(mediaCardSelector());

      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Load ADF with media inside a table',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaImageTableAdf);
      await page.waitForSelector(mediaCardSelector());
      await focusOnWebView(page);
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Resize a MediaSingle node',
    // TODO: Enable ios resizing test https://product-fabric.atlassian.net/browse/EDM-1845
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaSingleAdf);
      await waitForAtLeastNumFileCards(page, 1);

      await resizeMediaSingle(page, {
        units: 'pixels',
        amount: 50,
      });

      await mobileSnapshot(page);
    },
  );

  MobileTestCase('Media: failed processing', {}, async (client) => {
    const page = await Page.create(client);

    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, mediaSingleVideoFailedProcessingAdf);
    await page.waitForSelector(mediaCardSelector('failed-processing'));
    await mobileSnapshot(page);
  });

  MobileTestCase('Media: error', {}, async (client) => {
    const page = await Page.create(client);

    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, mediaSingleEmptyFileAdf);
    await page.waitForSelector(mediaCardSelector('error'));
    await mobileSnapshot(page);
  });
};
