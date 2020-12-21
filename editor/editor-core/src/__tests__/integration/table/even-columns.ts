import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
  doubleClickResizeHandle,
} from '../_helpers';
import {
  clickFirstCell,
  selectTable,
} from '../../__helpers/page-objects/_table';
import {
  tableWithUnevenColumns,
  tableWithUnevenColumnsInOverflow,
} from './__fixtures__/even-columns';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

// moveTo in doubleClickResizeHandle does not work for safari
BrowserTestCase(
  'Should even columns on double click on resize handle when table is selected',
  { skip: ['safari', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

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
  { skip: ['safari', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

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
