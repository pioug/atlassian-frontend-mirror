import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../_utils/afe-app-helpers';
import { loadRenderer } from '../_page-objects/hybrid-renderer-page';
import basicAdf from '../__fixtures__/basic-content.adf.json';
import { mobileSnapshot } from '../_utils/snapshot';

export default async () => {
  MobileTestCase(
    'Renderer Text: Load ADF with different text nodes displayed',
    {},
    async client => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await setADFContent(page, basicAdf, 'renderer');
      await mobileSnapshot(page);
    },
  );
};
