import {
  MobileTestCase,
  DynamicMobileTestSuite,
  getDynamicMobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import { setADFContent } from '../../_utils/afe-app-helpers';
import mediaGroupMultipleAdf from '../../__fixtures__/media-group-multiple.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';
import { mediaCardSelector } from '../../_utils/media';

type TestName =
  | 'Media Group: Load MediaGroup that contains multiple files'
  | 'Media Group: Select the file in media group'
  | 'Media Group: Remove a file from the media group';

const mediaGroupTest: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  DynamicMobileTestCase(
    'Media Group: Load MediaGroup that contains multiple files',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.switchToWeb();
      await setADFContent(page, mediaGroupMultipleAdf);
      await page.waitForSelector('[data-testid="media-filmstrip"]');
      await mediaCardSelector();

      const filmstrip = await page.$('[data-testid="media-filmstrip"]');
      await filmstrip.scrollIntoView();

      await page.switchToNative();
      await mobileSnapshot(page);
    },
  );

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  DynamicMobileTestCase(
    'Media Group: Select the file in media group',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.switchToWeb();
      await setADFContent(page, mediaGroupMultipleAdf);
      await page.waitForSelector('[data-testid="media-filmstrip"]');
      await mediaCardSelector();

      const filmstrip = await page.$('[data-testid="media-filmstrip"]');
      await filmstrip.scrollIntoView();

      const cards = await page.$$(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
      await cards[0].click();
      await page.switchToNative();
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Media Group: Remove a file from the media group',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.switchToWeb();
      await setADFContent(page, mediaGroupMultipleAdf);
      await page.waitForSelector('[data-testid="media-filmstrip"]');
      await page.waitForSelector(mediaCardSelector());

      const cross = await page.$$('[data-testid="media-card-primary-action"]');
      await cross[0].click();

      await page.switchToNative();
      await mobileSnapshot(page);
    },
  );

  //DynamicMobileTestCase(
  //  'Media Group: Upload multiple files should group into a media group',
  //  {},
  //  async (client) => {
  //    const page = await Page.create(client);
  //    await loadEditor(page);
  //    await page.switchToWeb();
  //    await uploadMedia(page, testMediaGroupFileId);
  //    await uploadMedia(page, testMediaGroupFileId1);
  //    await uploadMedia(page, testMediaGroupFileId2);
  //    await page.waitForSelector('[data-testid="media-filmstrip"]');
  //    await mediaCardSelector();

  //    const filmstrip = await page.$('[data-testid="media-filmstrip"]');
  //    await filmstrip.scrollIntoView();

  //    await page.switchToNative();
  //    await mobileSnapshot(page);
  //  },
  //);
};

export default mediaGroupTest;
