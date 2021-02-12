import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  configureEditor,
  isDecisionAdded,
  isDecisionPanelVisible,
  loadEditor,
} from '../../_page-objects/hybrid-editor-page';
import { ENABLE_QUICK_INSERT } from '../../_utils/configurations';
import { DECISION_QUICK_INSERT } from '../../_utils/quick-inserts';

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
