import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  insertMentionUsingClick,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from './_utils';

BrowserTestCase(
  'mention.ts: Can insert mention inside panel using click',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await insertMentionUsingClick(page, '0');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
