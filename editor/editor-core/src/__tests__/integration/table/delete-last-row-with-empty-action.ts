import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'delete-last-row.ts: Delete last table row with empty action',
  { skip: ['ie', 'edge'] },
  async (client: any, testName: string) => {
    const FIRST_CELL_FROM_LAST_ROW =
      'table > tbody > tr:last-child > td:first-child';
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);

    // Insert table and click on first cell
    await quickInsert(page, 'Table');
    await page.waitForSelector(FIRST_CELL_FROM_LAST_ROW);
    await page.click(FIRST_CELL_FROM_LAST_ROW);

    // Add empty action on first cell from last row
    await quickInsert(page, 'Action item');

    // Select button wrapper from last row
    const controlSelector = `.${ClassName.ROW_CONTROLS_WRAPPER} .${ClassName.ROW_CONTROLS_BUTTON_WRAP}:last-child .${ClassName.CONTROLS_BUTTON}`;
    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);

    // Click on delete row button
    const deleteButtonSelector = `.${ClassName.CONTROLS_DELETE_BUTTON_WRAP} .${ClassName.CONTROLS_DELETE_BUTTON}`;
    await page.waitForVisible(deleteButtonSelector);
    await page.click(deleteButtonSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
