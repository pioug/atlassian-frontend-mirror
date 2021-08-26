import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'delete-last-column-with-empty-action.ts: Delete last table column with empty action',
  {},
  async (client: any, testName: string) => {
    const LAST_HEADER_FROM_FIRST_ROW =
      'table > tbody > tr:first-child > th:last-child';

    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);

    // Insert table and click on last cell of first row
    await quickInsert(page, 'Table');
    await page.waitForSelector(LAST_HEADER_FROM_FIRST_ROW);
    await page.click(LAST_HEADER_FROM_FIRST_ROW);

    // Add empty action on first cell from last row
    await quickInsert(page, 'Action item');

    // Select button wrapper from last column
    const controlSelector = `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index="2"]`;
    await page.waitForSelector(controlSelector);
    // We need to move the mouse to the column control first
    await page.hover(controlSelector);
    await page.click(controlSelector);

    // Click on delete row button
    const deleteButtonSelector = `.${ClassName.CONTROLS_DELETE_BUTTON_WRAP} .${ClassName.CONTROLS_DELETE_BUTTON}`;
    await page.waitForVisible(deleteButtonSelector);
    await page.click(deleteButtonSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
