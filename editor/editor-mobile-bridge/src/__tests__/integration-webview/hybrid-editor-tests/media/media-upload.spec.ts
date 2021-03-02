import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { uploadMedia } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';

MobileTestCase('Media: Upload media', {}, async client => {
  const page = await Page.create(client);
  await loadEditor(page);
  await page.switchToWeb();
  await uploadMedia(page);
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
});
