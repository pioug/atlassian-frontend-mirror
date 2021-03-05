import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import media2ColumnLayoutAdf from '../../__fixtures__/media-2-column-layout.adf.json';
import media3ColumnLayoutAdf from '../../__fixtures__/media-3-column-layout.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

MobileTestCase('Media in Layouts: 2 column', {}, async client => {
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
});

MobileTestCase('Media in Layouts: 3 columns', {}, async client => {
  const page = await Page.create(client);

  await loadEditor(page);
  await page.switchToWeb();
  await setADFContent(page, media3ColumnLayoutAdf);
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
  const layout = await page.$('[data-layout-section="true"]');
  await layout.scrollIntoView();
  await mobileSnapshot(page);
});
