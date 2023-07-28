import {
  MobileTestCase,
  DynamicMobileTestSuite,
  getDynamicMobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../_utils/afe-app-helpers';
import { loadRenderer } from '../_page-objects/hybrid-renderer-page';
import mediaGroupAdf from '../__fixtures__/media-group.adf.json';
import mediaSingleAdf from '../__fixtures__/media-single.adf.json';
import media2ColumnLayoutAdf from '../__fixtures__/media-2-column-layout.adf.json';
import media3ColumnLayoutAdf from '../__fixtures__/media-3-column-layout.adf.json';
import mediaSingleVideoAdf from '../__fixtures__/media-single-video.adf.json';
import mediaExpandAdf from '../__fixtures__/media-expand.adf.json';
import mediaSingleWithCaptionAdf from '../__fixtures__/media-single-caption.adf.json';
import { mobileSnapshot } from '../_utils/snapshot';
import { waitForMedia } from '../_utils/media';

type TestName =
  | 'Renderer Media: Load ADF with a MediaGroup node'
  | 'Renderer Media: Load ADF with a MediaSingle node'
  | 'Renderer Media in Layouts: 2 column'
  | 'Renderer Media in Layouts: 3 columns'
  | 'Renderer Media inside expand'
  | 'Renderer Media: MediaSingle video file'
  | 'Renderer Media: Load ADF with a MediaSingle with caption node'
  | 'Renderer Media: Should not render caption when caption is turned off';

const mediaRendererTests: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  DynamicMobileTestCase(
    'Renderer Media: Load ADF with a MediaGroup node',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await setADFContent(page, mediaGroupAdf, 'renderer');
      await waitForMedia(page);
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media: Load ADF with a MediaSingle node',
    // TODO: https://product-fabric.atlassian.net/browse/MEX-1842
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await setADFContent(page, mediaSingleAdf, 'renderer');
      await waitForMedia(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media in Layouts: 2 column',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);

      await loadRenderer(page);
      await page.switchToWeb();
      await setADFContent(page, media2ColumnLayoutAdf, 'renderer');
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
      const layout = await page.$('[data-layout-section="true"]');
      await layout.scrollIntoView();
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media in Layouts: 3 columns',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);

      await loadRenderer(page);
      await page.switchToWeb();
      await setADFContent(page, media3ColumnLayoutAdf, 'renderer');
      await waitForMedia(page);
      const layout = await page.$('[data-layout-section="true"]');
      await layout.scrollIntoView();
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media inside expand',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);

      await loadRenderer(page);
      await page.switchToWeb();
      await setADFContent(page, mediaExpandAdf, 'renderer');
      await waitForMedia(page);
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media: MediaSingle video file',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await page.switchToWeb();
      await setADFContent(page, mediaSingleVideoAdf, 'renderer');
      await waitForMedia(page);
      await page.waitForSelector('[data-testid="media-card-play-button"]');
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media: Load ADF with a MediaSingle with caption node',
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page, { allowCaptions: true });
      await setADFContent(page, mediaSingleWithCaptionAdf, 'renderer');
      await waitForMedia(page);
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'Renderer Media: Should not render caption when caption is turned off',
    // TODO: https://product-fabric.atlassian.net/browse/ME-1641
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await setADFContent(page, mediaSingleWithCaptionAdf, 'renderer');
      await waitForMedia(page);
      await mobileSnapshot(page);
    },
  );
};

export default mediaRendererTests;
