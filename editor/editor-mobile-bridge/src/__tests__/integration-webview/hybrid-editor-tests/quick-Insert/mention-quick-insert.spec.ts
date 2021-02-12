import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  configureEditor,
  isMentionSymbolVisible,
} from '../../_page-objects/hybrid-editor-page';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import { ENABLE_QUICK_INSERT } from '../../_utils/configurations';
import { MENTION_QUICK_INSERT } from '../../_utils/quick-inserts';

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
