import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { assert } from 'chai';
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

    assert.isTrue(
      await isDecisionPanelVisible(page),
      'Decision Panel is not visible!',
    );

    const decisionText = 'Adding a Decision';
    await page.tapKeys(decisionText);

    assert.isTrue(
      await isDecisionAdded(page, decisionText),
      'Decision is not added!',
    );
  },
);
