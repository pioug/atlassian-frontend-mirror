import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from './_utils';

BrowserTestCase(
  'change-type.ts: Change the type of panel to Error',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);
    await page.type(editable, 'this text should be in the panel');

    // Change panel type to Error
    const selector = `[aria-label="Error"]`;
    await page.click(selector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
