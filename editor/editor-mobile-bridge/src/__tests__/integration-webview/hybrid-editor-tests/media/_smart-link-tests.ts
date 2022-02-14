import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/lib/appium/keyboard/common-osk';
import { inlineCardSelector } from '@atlaskit/media-integration-test-helpers';
import { setADFContent } from '../../_utils/afe-app-helpers';
import {
  loadEditor,
  focusOnWebView,
} from '../../_page-objects/hybrid-editor-page';
import smartLinkAdf from '../../__fixtures__/smart-link.adf.json';
import smartLinkExpandAdf from '../../__fixtures__/smart-link-expand.adf.json';
import smartLinkListAdf from '../../__fixtures__/smart-link-list.adf.json';
import smartLinkListAdf2 from '../../__fixtures__/smart-link-list-2.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

export default () => {
  const loadEditorWithAdf = async (page: Page, adf: any) => {
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, adf);
    await page.waitForSelector(inlineCardSelector());
    await focusOnWebView(page);
  };

  MobileTestCase(
    'SmartLinks: inline',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkAdf);
      await mobileSnapshot(page);
    },
  );

  MobileTestCase(
    'SmartLinks: expand',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkExpandAdf);
      await mobileSnapshot(page);
    },
  );

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  //MobileTestCase('SmartLinks: table', {}, async (client) => {
  //  const page = await Page.create(client);
  //  await loadEditorWidthAdf(page, smartLinkTableAdf);
  //  if (page.isAndroid()) {
  //    await focusOnWebView(page);
  //  }
  //  await mobileSnapshot(page);
  //});

  MobileTestCase(
    'SmartLinks: list',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkListAdf);
      await page.switchToWeb();
      await page.waitForSelector('ul');
      const inlineLink = await page.$(inlineCardSelector());
      await inlineLink.scrollIntoView();
      await mobileSnapshot(page);
    },
  );

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

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  // MobileTestCase('SmartLinks: blue link', {}, async (client) => {
  //   const page = await Page.create(client);
  //   await loadEditor(page);
  //   await page.switchToWeb();
  //   await setADFContent(page, blueLinkAdf);
  //   await page.waitForSelector('a');
  //   await focusOnWebView(page);
  //   await mobileSnapshot(page);
  // });

  MobileTestCase(
    'SmartLinks: backspace smart card',
    { skipPlatform: ['*'] },
    async (client: any) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkListAdf2);
      await page.tapKeys(SPECIAL_KEYS.DELETE);
      await page.tapKeys(SPECIAL_KEYS.DELETE);
      if (page.isIOS()) {
        await page.tapKeys(SPECIAL_KEYS.DELETE);
      }
      await mobileSnapshot(page);
    },
  );
};
