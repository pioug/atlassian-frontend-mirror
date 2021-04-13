import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import { uploadMedia } from '../../_utils/afe-app-helpers';
import mediaSingleAdf from '../../__fixtures__/media-single.adf.json';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import media2ColumnLayoutAdf from '../../__fixtures__/media-2-column-layout.adf.json';
import media3ColumnLayoutAdf from '../../__fixtures__/media-3-column-layout.adf.json';
import mediaGroupAdf from '../../__fixtures__/media-group.adf.json';
import mediaImageTableAdf from '../../__fixtures__/media-image-table.adf.json';
import { focusOnWebView } from '../../_page-objects/hybrid-editor-page';
import mediaExpandAdf from '../../__fixtures__/media-expand.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';
import {
  waitForAtLeastNumFileCards,
  resizeMediaSingle,
} from '../../_utils/media';

export default async () => {
  MobileTestCase(
    'Media: user can remove mediaSingle node',
    {},
    async client => {
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
    },
  );

  MobileTestCase('Media: Upload media', {}, async client => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.switchToWeb();
    await uploadMedia(page);
    await page.waitForSelector(
      '[data-testid="media-file-card-view"][data-test-status="complete"]',
    );
  });

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

  MobileTestCase('Media inside expand', {}, async client => {
    const page = await Page.create(client);

    await loadEditor(page, 'enableMediaResize=true');
    await page.switchToWeb();
    await setADFContent(page, mediaExpandAdf);
    await page.waitForSelector(
      '[data-testid="media-file-card-view"][data-test-status="complete"]',
    );
    await focusOnWebView(page);
    await mobileSnapshot(page);
  });

  MobileTestCase(
    'Media: Load ADF with a MediaSingle node',
    {},
    async client => {
      const page = await Page.create(client);
      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaSingleAdf);
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );

      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Load ADF with media inside a table',
    {},
    async client => {
      const page = await Page.create(client);
      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaImageTableAdf);
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );

      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Resize a MediaSingle node',
    // TODO: Enable ios resizing test https://product-fabric.atlassian.net/browse/EDM-1845
    { skipPlatform: ['ios'] },
    async client => {
      const page = await Page.create(client);
      await loadEditor(page, 'enableMediaResize=true');
      await page.switchToWeb();
      await setADFContent(page, mediaSingleAdf);
      await waitForAtLeastNumFileCards(page, 1);

      await resizeMediaSingle(page, {
        units: 'pixels',
        amount: 50,
      });

      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'Media: Upload media should show the progressive bar',
    {},
    async client => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.switchToWeb();
      await uploadMedia(page);
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
    },
  );
};
