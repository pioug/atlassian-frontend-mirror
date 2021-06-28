import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { inlineCardSelector } from '@atlaskit/media-integration-test-helpers';
import { setADFContent } from '../_utils/afe-app-helpers';
import { loadRenderer } from '../_page-objects/hybrid-renderer-page';
import smartLinkInlineAdf from '../__fixtures__/smart-link.adf.json';
import { mobileSnapshot } from '../_utils/snapshot';

export default () => {
  MobileTestCase('SmartLinks Renderer: inline', {}, async (client) => {
    const page = await Page.create(client);
    await loadRenderer(page);
    await setADFContent(page, smartLinkInlineAdf, 'renderer');
    await page.waitForSelector(inlineCardSelector());
    await mobileSnapshot(page);
  });
};
