import {
  MobileTestCase,
  DynamicMobileTestSuite,
  getDynamicMobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
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

type TestName =
  | 'Media: user can remove mediaSingle node'
  | 'Media: Upload media'
  | 'Media in Layouts: 2 column'
  | 'Media in Layouts: 3 columns'
  | 'Media: Load and delete MediaGroup'
  | 'Media inside expand'
  | 'Media: Load ADF with a MediaSingle node'
  | 'Media: Load ADF with media inside a table'
  | 'Media: Resize a MediaSingle node'
  | 'Media: failed processing'
  | 'Media: error';

const mediaEditorTests: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  const setup = async (
    client: any,
    content?: ADFEntity,
    waitForSelector?: string,
  ) => {
    const page = await Page.create(client);
    await loadEditor(page);
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

  DynamicMobileTestCase(
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

  DynamicMobileTestCase(
    'Media: Upload media',
    // TODO: https://product-fabric.atlassian.net/browse/MEX-1842
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client);
      await uploadMedia(page);
      await page.waitForSelector(mediaCardSelector());
    },
  );

  DynamicMobileTestCase(
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

  DynamicMobileTestCase(
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

  DynamicMobileTestCase(
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

  DynamicMobileTestCase(
    'Media inside expand',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaExpandAdf, mediaCardSelector());
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Media: Load ADF with a MediaSingle node',
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaSingleAdf, mediaCardSelector());
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Media: Load ADF with media inside a table',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaImageTableAdf, mediaCardSelector());
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Media: Resize a MediaSingle node',
    // TODO: Enable ios resizing test https://product-fabric.atlassian.net/browse/EDM-1845
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(client, mediaSingleAdf, undefined);
      await waitForAtLeastNumFileCards(page, 1);
      await page.switchToWeb();

      await resizeMediaSingle(page, {
        units: 'pixels',
        amount: 50,
      });

      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
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

  DynamicMobileTestCase(
    'Media: error',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await setup(
        client,
        mediaSingleEmptyFileAdf,
        mediaCardSelector('error'),
      );
      await mobileSnapshot(page);
    },
  );
};

export default mediaEditorTests;
