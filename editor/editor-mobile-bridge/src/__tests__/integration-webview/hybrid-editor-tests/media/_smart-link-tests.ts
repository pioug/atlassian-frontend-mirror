import {
  getDynamicMobileTestCase,
  DynamicMobileTestSuite,
  MobileTestCase,
} from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/lib/appium/keyboard/common-osk';
import { inlineCardSelector } from '@atlaskit/media-integration-test-helpers';
import { setADFContent } from '../../_utils/afe-app-helpers';
import {
  loadEditor,
  focusOnWebView,
} from '../../_page-objects/hybrid-editor-page';
import smartLinkAdf from '../../__fixtures__/smart-link.adf.json';
import smartLinkTableAdf from '../../__fixtures__/smart-link-table.adf.json';
import blueLinkAdf from '../../__fixtures__/blue-link.adf.json';
import smartLinkLayoutAdf from '../../__fixtures__/smart-link-layout.adf.json';
import smartLinkExpandAdf from '../../__fixtures__/smart-link-expand.adf.json';
import smartLinkListAdf from '../../__fixtures__/smart-link-list.adf.json';
import smartLinkListAdf2 from '../../__fixtures__/smart-link-list-2.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

type TestName =
  | 'SmartLinks: inline'
  | 'SmartLinks: table'
  | 'SmartLinks: expand'
  | 'SmartLinks: list'
  | 'SmartLinks: layout'
  | 'SmartLinks: blue link'
  | 'SmartLinks: backspace smart card';

const smartLinkEditorTestSuite: DynamicMobileTestSuite<TestName> = async ({
  skipTests,
}) => {
  const DynamicMobileTestCase = getDynamicMobileTestCase({
    TestCase: MobileTestCase,
    skipTests,
  });

  const loadEditorWithAdf = async (page: Page, adf: any) => {
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, adf);
    await page.waitForSelector(inlineCardSelector());
    await focusOnWebView(page);
  };

  DynamicMobileTestCase(
    'SmartLinks: inline',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkAdf);
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
    'SmartLinks: expand',
    { skipPlatform: ['*'] },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkExpandAdf);
      await mobileSnapshot(page);
    },
  );

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  DynamicMobileTestCase(
    'SmartLinks: table',
    {
      skipPlatform: ['*'],
    },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkTableAdf);
      if (page.isAndroid()) {
        await focusOnWebView(page);
      }
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
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
  DynamicMobileTestCase(
    'SmartLinks: layout',
    {
      skipPlatform: ['*'],
    },
    async (client) => {
      const page = await Page.create(client);
      await loadEditorWithAdf(page, smartLinkLayoutAdf);
      const layout = await page.$('[data-layout-section="true"]');
      await layout.scrollIntoView();
      if (page.isAndroid()) {
        await focusOnWebView(page);
      }
      await mobileSnapshot(page);
    },
  );

  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  DynamicMobileTestCase(
    'SmartLinks: blue link',
    {
      skipPlatform: ['*'],
    },
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.switchToWeb();
      await setADFContent(page, blueLinkAdf);
      await page.waitForSelector('a');
      await focusOnWebView(page);
      await mobileSnapshot(page);
    },
  );

  DynamicMobileTestCase(
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

export default smartLinkEditorTestSuite;
