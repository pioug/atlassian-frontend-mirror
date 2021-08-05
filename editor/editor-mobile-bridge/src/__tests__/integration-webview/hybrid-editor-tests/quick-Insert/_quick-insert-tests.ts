import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  configureEditor,
  isActionItemVisible,
  isActionItemHelpTextTranslatedToZH,
  focusOnWebView,
  isBlockQuoteAdded,
  isCodeBlockAdded,
  isDecisionAdded,
  isDecisionPanelVisible,
  isInfoPanelVisible,
  isWarningPanelVisible,
  isErrorPanelVisible,
  isMentionSymbolVisible,
} from '../../_page-objects/hybrid-editor-page';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/lib/appium/keyboard/common-osk';
import {
  ENABLE_QUICK_INSERT,
  ENABLE_QUICK_INSERT_AND_SET_LOCALE_TO_ZH,
} from '../../_utils/configurations';
import {
  ACTION_ITEM_QUICK_INSERT,
  BLOCK_QUOTE_QUICK_INSERT,
  CODE_BLOCK_QUICK_INSERT,
  DECISION_QUICK_INSERT,
  INFORMATION_PANEL_QUICK_INSERT,
  WARNING_PANEL_QUICK_INSERT,
  ERROR_PANEL_QUICK_INSERT,
  MENTION_QUICK_INSERT,
} from '../../_utils/quick-inserts';

export default async () => {
  MobileTestCase(
    'Quick Insert - Action Item: Users can add an action item by typing "/action" and pressing enter',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(ACTION_ITEM_QUICK_INSERT[1]);
      await page.tapKeys(SPECIAL_KEYS.ENTER);

      expect(await isActionItemVisible(page)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Action Item: Users can add and see localized action item by typing "/" and pressing enter',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT_AND_SET_LOCALE_TO_ZH);
      await focusOnWebView(page);
      await page.tapKeys(ACTION_ITEM_QUICK_INSERT[1]);
      await page.tapKeys(SPECIAL_KEYS.ENTER);

      expect(await isActionItemHelpTextTranslatedToZH(page)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Panel: Users can add an info panel by typing "/info" and pressing enter',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(INFORMATION_PANEL_QUICK_INSERT);
      await page.tapKeys(SPECIAL_KEYS.ENTER);
      expect(await isInfoPanelVisible(page)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Panel: Users can add an warning panel by typing "/warning" and pressing enter',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(WARNING_PANEL_QUICK_INSERT);
      await page.tapKeys(SPECIAL_KEYS.ENTER);
      expect(await isWarningPanelVisible(page)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Panel: Users can add an error panel by typing "/error" and pressing enter',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(ERROR_PANEL_QUICK_INSERT);
      await page.tapKeys(SPECIAL_KEYS.ENTER);
      expect(await isErrorPanelVisible(page)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Mention: Users can add an mention by typing "/mention" and pressing enter',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(MENTION_QUICK_INSERT);
      await page.tapKeys(SPECIAL_KEYS.ENTER);

      expect(await isMentionSymbolVisible(page)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Decision: Users can add a decision panel and a decision description',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(DECISION_QUICK_INSERT);
      await page.tapKeys(SPECIAL_KEYS.ENTER);

      expect(await isDecisionPanelVisible(page)).toBe(true);

      const decisionText = 'Adding a Decision';
      await page.tapKeys(decisionText);

      expect(await isDecisionAdded(page, decisionText)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Block Quote: Users can add a block quote by typing ">" and pressing space',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(BLOCK_QUOTE_QUICK_INSERT);
      await page.tapKeys(SPECIAL_KEYS.SPACE);
      const blockQuoteText = 'Quote';
      await page.tapKeys(blockQuoteText);

      expect(await isBlockQuoteAdded(page, blockQuoteText)).toBe(true);
    },
  );

  MobileTestCase(
    'Quick Insert - Code Block: Users can add a code block by typing "```"',
    /**
     * In iOS the '`'(Back Tick) is an extra key that shows up only upon long pressing a '''(Single quote).
     * Need to find a way to select this extra key through appium
     */
    { skipPlatform: ['ios'] },
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await configureEditor(page, ENABLE_QUICK_INSERT);
      await focusOnWebView(page);
      await page.tapKeys(CODE_BLOCK_QUICK_INSERT);
      const codeBlockText = 'Code';
      await page.tapKeys(codeBlockText);

      expect(await isCodeBlockAdded(page, codeBlockText)).toBe(true);
    },
  );
};
