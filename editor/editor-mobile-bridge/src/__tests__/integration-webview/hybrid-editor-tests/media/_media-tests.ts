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
import type { ADFEntity } from '@atlaskit/adf-utils/types';

export default async () => {
  const setup = async (
    client: any,
    content?: ADFEntity,
    waitForSelector?: string,
    editorParams?: string,
  ) => {
    const page = await Page.create(client);
    await loadEditor(page, editorParams);
    if (content) {
      await setADFContent(page, content);
    }
    await focusOnWebView(page);
    await page.switchToWeb();
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector);
    }
    return page;
  };

  MobileTestCase(
    'Media: user can remove mediaSingle node',
    // This test is really not behaving correctly on android.
    // Tested on device and works fine.
    { skipPlatform: ['android'] },
    async (client) => {
      const page = await setup(client, mediaSingleAdf, mediaCardSelector());
      const media = await page.$(mediaCardSelector());
      await media.waitForDisplayed();
      await media.click();

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
    const page = await setup(client);
    await uploadMedia(page);
    await page.waitForSelector(mediaCardSelector());
  });

  MobileTestCase(
    'Media in Layouts: 2 column',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(
        client,
        media2ColumnLayoutAdf,
        mediaCardSelector(),
      );
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media in Layouts: 3 columns',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(
        client,
        media3ColumnLayoutAdf,
        mediaCardSelector(),
      );
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Load and delete MediaGroup',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaGroupAdf, mediaCardSelector());
      const card = await page.$(mediaCardSelector());
      await card.click();

      await mobileSnapshot(page);
      // ensure card is selected
      await page.switchToWeb();
      // Delete media group
      await page.click(
        '[data-testid="media-file-card-view"] [data-testid="media-card-primary-action"]',
      );

      const mediaGroupExists = await page.isExisting(
        '[data-testid="media-filmstrip"]',
      );
      // Ensure MediaGroup is deleted
      expect(mediaGroupExists).toBeFalsy();
    },
  );

  MobileTestCase(
    'Media inside expand',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaExpandAdf, mediaCardSelector());
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Load ADF with a MediaSingle node',
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaSingleAdf, mediaCardSelector());
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Load ADF with media inside a table',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaImageTableAdf, mediaCardSelector());
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Resize a MediaSingle node',
    // TODO: Enable ios resizing test https://product-fabric.atlassian.net/browse/EDM-1845
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(
        client,
        mediaSingleAdf,
        undefined,
        'enableMediaResize=true',
      );
      await waitForAtLeastNumFileCards(page, 1);
      await page.switchToWeb();

      await resizeMediaSingle(page, {
        units: 'pixels',
        amount: 50,
      });

      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: failed processing',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(
        client,
        mediaSingleVideoFailedProcessingAdf,
        mediaCardSelector('failed-processing'),
      );
      await mobileSnapshot(page);
    },
  );

  MobileTestCase('Media: error', { skipPlatform: ['*'] }, async (client) => {
    const page = await setup(
      client,
      mediaSingleEmptyFileAdf,
      mediaCardSelector('error'),
    );
    await mobileSnapshot(page);
  });
};
