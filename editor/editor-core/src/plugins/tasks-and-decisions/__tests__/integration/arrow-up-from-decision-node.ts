import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  expectToMatchSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  paragraphWithDecisionList,
  paragraphWithDecisionListWithoutContent,
} from '../__fixtures__/paragraph-with-decision-list-adf';

const DECISION_PANEL_TYPE = 'div.decision-item';

const testUpArrowDecision = (defaultValue: Object) => async (client: any) => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    allowTasksAndDecisions: true,
    defaultValue: JSON.stringify(defaultValue),
  });

  await page.waitForSelector(DECISION_PANEL_TYPE);
  await page.click(DECISION_PANEL_TYPE);
  await page.keys('ArrowUp');
  await expectToMatchSelection(page, { type: 'text', anchor: 5, head: 5 });
};

BrowserTestCase(
  'arrow-up-from-decision-node.ts: pressing arrow up in decision node should move cursor into paragraph above',
  { skip: [] },
  testUpArrowDecision(paragraphWithDecisionList),
);

BrowserTestCase(
  'arrow-up-from-decision-node.ts: pressing arrow up in decision node should move cursor into paragraph above without content',
  { skip: [] },
  testUpArrowDecision(paragraphWithDecisionListWithoutContent),
);
