import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { loadEditor, setADFContent } from './_utils/afe-app-helpers';
import mediaSingleAdf from './__fixtures__/media-single.adf.json';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';

MobileTestCase('Media: user can remove mediaSingle node', {}, async client => {
  const page = await Page.create(client);
  await loadEditor(page);
  await setADFContent(page, mediaSingleAdf);
  await page.waitForSelector(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
  await page.switchToNative();
  // Delete MediaSingle
  await page.tapKeys(SPECIAL_KEYS.DELETE);
  await page.switchToWeb();
  const mediaSingleExists = await page.isExisting(
    '[data-testid="media-file-card-view"][data-test-status="complete"]',
  );
  // Ensure MediaSingle is deleted
  expect(mediaSingleExists).toBeFalsy();
});
