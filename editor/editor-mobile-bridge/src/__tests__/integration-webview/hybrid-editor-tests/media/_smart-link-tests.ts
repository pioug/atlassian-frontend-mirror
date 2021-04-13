import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import smartLinkAdf from '../../__fixtures__/smart-link.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

export default () => {
  MobileTestCase('SmartLinks: inline', {}, async client => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, smartLinkAdf);
    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');
    await mobileSnapshot(page);
  });
};
