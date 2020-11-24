import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { loadEditor, setADFContent } from './_utils/afe-app-helpers';
import mediaSingleAdf from './__fixtures__/media-single.adf.json';

MobileTestCase('Media: Load ADF with a MediaSingle node', {}, async client => {
  const page = await Page.create(client);
  await loadEditor(page);
  await page.switchToWeb();
  await setADFContent(page, mediaSingleAdf);
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
});
