import {
  doubleClickResizeHandle,
  editable,
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  clickFirstCell,
  selectTable,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  tableWithUnevenColumns,
  tableWithUnevenColumnsInOverflow,
} from './__fixtures__/even-columns';

// moveTo in doubleClickResizeHandle does not work for safari
BrowserTestCase(
  'Should even columns on double click on resize handle when table is selected',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithUnevenColumns),
      allowTables: {
        advanced: true,
      },
    });
    await clickFirstCell(page);
    await selectTable(page);
    await doubleClickResizeHandle(page, 2, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// moveTo in doubleClickResizeHandle does not work for safari
BrowserTestCase(
  'Should even columns and remain overflown on double click on resize handle when table is selected',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithUnevenColumnsInOverflow),
      allowTables: {
        advanced: true,
      },
    });
    await clickFirstCell(page);
    await selectTable(page);
    await doubleClickResizeHandle(page, 2, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
