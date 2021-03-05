import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import {
  loadEditor,
  focusOnWebView,
} from '../../_page-objects/hybrid-editor-page';
import mediaExpandAdf from '../../__fixtures__/media-expand.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

MobileTestCase('Media inside expand', {}, async client => {
  const page = await Page.create(client);

  await loadEditor(page);
  await page.switchToWeb();
  await setADFContent(page, mediaExpandAdf);
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
  await focusOnWebView(page);
  await mobileSnapshot(page);
});
