import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { inlineCardSelector } from '@atlaskit/media-integration-test-helpers';
import { setADFContent } from '../../_utils/afe-app-helpers';
import {
  loadEditor,
  focusOnWebView,
} from '../../_page-objects/hybrid-editor-page';
import smartLinkAdf from '../../__fixtures__/smart-link.adf.json';
import smartLinkExpandAdf from '../../__fixtures__/smart-link-expand.adf.json';
import smartLinkListAdf from '../../__fixtures__/smart-link-list.adf.json';
import blueLinkAdf from '../../__fixtures__/blue-link.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

export default () => {
  const loadEditorWidthAdf = async (page: Page, adf: any) => {
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, adf);
    await page.waitForSelector(inlineCardSelector());
  };

  MobileTestCase('SmartLinks: inline', {}, async (client) => {
    const page = await Page.create(client);
    await loadEditorWidthAdf(page, smartLinkAdf);
    await page.switchToNative();
    if (page.isAndroid()) {
      await focusOnWebView(page);
    }
    await mobileSnapshot(page);
  });

  MobileTestCase('SmartLinks: expand', {}, async (client) => {
    const page = await Page.create(client);
    await loadEditorWidthAdf(page, smartLinkExpandAdf);
    if (page.isAndroid()) {
      await focusOnWebView(page);
    }
    await mobileSnapshot(page);
  });

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  //MobileTestCase('SmartLinks: table', {}, async (client) => {
  //  const page = await Page.create(client);
  //  await loadEditorWidthAdf(page, smartLinkTableAdf);
  //  if (page.isAndroid()) {
  //    await focusOnWebView(page);
  //  }
  //  await mobileSnapshot(page);
  //});

  MobileTestCase('SmartLinks: list', {}, async (client) => {
    const page = await Page.create(client);
    await loadEditorWidthAdf(page, smartLinkListAdf);
    await page.waitForSelector('ul');
    const inlineLink = await page.$(inlineCardSelector());
    await inlineLink.scrollIntoView();
    await mobileSnapshot(page);
  });

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  //MobileTestCase('SmartLinks: layout', {}, async (client) => {
  //  const page = await Page.create(client);
  //  await loadEditorWidthAdf(page, smartLinkLayoutAdf);
  //  const layout = await page.$('[data-layout-section="true"]');
  //  await layout.scrollIntoView();
  //  if (page.isAndroid()) {
  //    await focusOnWebView(page);
  //  }
  //  await mobileSnapshot(page);
  //});

  MobileTestCase('SmartLinks: blue link', {}, async (client) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, blueLinkAdf);
    await page.waitForSelector('a');
    if (page.isAndroid()) {
      await focusOnWebView(page);
    }
    await mobileSnapshot(page);
  });
};
