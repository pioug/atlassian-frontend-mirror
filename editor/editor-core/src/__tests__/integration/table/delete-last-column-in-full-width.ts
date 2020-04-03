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

// ED-6231
BrowserTestCase(
  'Delete last table column in full-width mode',
  // Only Chrome has logging support in BrowserStack now
  { skip: ['ie', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);

    // Insert table
    await quickInsert(page, 'Table');

    // Change layout to full-width
    await page.waitForSelector(`.${ClassName.LAYOUT_BUTTON}`);
    await page.click(`.${ClassName.LAYOUT_BUTTON}`);
    await page.click(`.${ClassName.LAYOUT_BUTTON}`);

    await page.click(editable);

    // Select button wrapper from last column
    const controlSelector = `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index="2"]`;
    await page.waitForSelector(controlSelector);
    await page.hover(controlSelector);
    await page.click(controlSelector);

    // Click on delete row button
    const deleteButtonSelector = `.${ClassName.CONTROLS_DELETE_BUTTON_WRAP} .${ClassName.CONTROLS_DELETE_BUTTON}`;
    await page.waitForVisible(deleteButtonSelector);
    await page.click(deleteButtonSelector);

    await page.checkConsoleErrors();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
