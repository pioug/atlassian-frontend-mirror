import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  configureEditor,
  isInfoPanelVisible,
  isWarningPanelVisible,
  isErrorPanelVisible,
} from '../../_page-objects/hybrid-editor-page';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import { ENABLE_QUICK_INSERT } from '../../_utils/configurations';
import {
  INFORMATION_PANEL_QUICK_INSERT,
  WARNING_PANEL_QUICK_INSERT,
  ERROR_PANEL_QUICK_INSERT,
} from '../../_utils/quick-inserts';

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
