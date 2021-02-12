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
