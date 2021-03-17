import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../_utils/afe-app-helpers';
import { loadRenderer } from '../_page-objects/hybrid-renderer-page';
import mediaGroupAdf from '../__fixtures__/media-group.adf.json';
import mediaSingleAdf from '../__fixtures__/media-single.adf.json';
import { mobileSnapshot } from '../_utils/snapshot';

export default async () => {
  MobileTestCase(
    'Renderer Media: Load ADF with a MediaGroup node',
    {},
    async client => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await setADFContent(page, mediaGroupAdf, 'renderer');
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Renderer Media: Load ADF with a MediaSingle node',
    {},
    async client => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await setADFContent(page, mediaSingleAdf, 'renderer');
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
    },
  );
};
