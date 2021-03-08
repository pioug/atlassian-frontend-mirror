import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import mediaGroupAdf from '../../__fixtures__/media-group.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

MobileTestCase('Media: Load and delete MediaGroup', {}, async client => {
  const page = await Page.create(client);
  await loadEditor(page);
  await page.switchToWeb();
  await setADFContent(page, mediaGroupAdf);
  await page.waitForSelector('[data-testid="media-filmstrip"]');
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
  const filmstrip = await page.$('[data-testid="media-filmstrip"]');
  await filmstrip.scrollIntoView();
  // On IOS MediaGroup is not focused by default, so we need to focus it manually
  if (page.isIOS()) {
    await page.switchToWeb();
    const card = await page.$(
      '[data-testid="media-file-card-view"][data-test-status="complete"]',
    );
    await card.click();
  }
  await mobileSnapshot(page);
  // ensure card is selected
  await page.switchToWeb();
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"][data-test-selected="true"]',
  );
  // Delete media group
  await page.click(
    '[data-testid="media-file-card-view"] [data-testid="media-card-primary-action"]',
  );

  const mediaGroupExists = await page.isExisting(
    '[data-testid="media-filmstrip"]',
  );
  // Ensure MediaGroup is deleted
  expect(mediaGroupExists).toBeFalsy();
});
