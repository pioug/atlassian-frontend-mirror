// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  fullpage,
  getDocFromElement,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

BrowserTestCase(
  'inside-table.ts: Insert panel into table, add text, change panel type',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);

    // Insert table
    await quickInsert(page, 'Table');

    await page.type(editable, 'this has a strong mark');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
