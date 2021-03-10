import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  configureEditor,
  isActionItemVisible,
  isActionItemHelpTextTranslatedToZH,
  focusOnWebView,
} from '../../_page-objects/hybrid-editor-page';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import {
  ENABLE_QUICK_INSERT,
  ENABLE_QUICK_INSERT_AND_SET_LOCALE_TO_ZH,
} from '../../_utils/configurations';
import { ACTION_ITEM_QUICK_INSERT } from '../../_utils/quick-inserts';
import {
  isDecisionAdded,
  isDecisionPanelVisible,
} from '../../_page-objects/hybrid-editor-page';
import { DECISION_QUICK_INSERT } from '../../_utils/quick-inserts';
import {
  isInfoPanelVisible,
  isWarningPanelVisible,
  isErrorPanelVisible,
} from '../../_page-objects/hybrid-editor-page';
import {
  INFORMATION_PANEL_QUICK_INSERT,
  WARNING_PANEL_QUICK_INSERT,
  ERROR_PANEL_QUICK_INSERT,
} from '../../_utils/quick-inserts';
import { isMentionSymbolVisible } from '../../_page-objects/hybrid-editor-page';
import { MENTION_QUICK_INSERT } from '../../_utils/quick-inserts';

MobileTestCase(
  'Quick Insert - Action Item: Users can add an action item by typing "/action" and pressing enter',
  {},
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await configureEditor(page, ENABLE_QUICK_INSERT);
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
    await page.tapKeys(DECISION_QUICK_INSERT);
    await page.tapKeys(SPECIAL_KEYS.ENTER);

    expect(await isDecisionPanelVisible(page)).toBe(true);

    const decisionText = 'Adding a Decision';
    await page.tapKeys(decisionText);

    expect(await isDecisionAdded(page, decisionText)).toBe(true);
  },
);
