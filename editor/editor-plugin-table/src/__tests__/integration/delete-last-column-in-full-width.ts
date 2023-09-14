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

import { TableCssClassName as ClassName } from '../../plugins/table/types';

// ED-6231
BrowserTestCase(
  'Delete last table column in full-width mode',
  // Only Chrome has logging support in BrowserStack now
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        allowTables: {
          advanced: true,
        },
      },
      { i18n: { locale: 'en' } },
    );

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

    // TODO: Figure out why this is causing a warning and causing the following check to fail in chrome.
    // await page.checkConsoleErrors({
    //   ignoreErrors: [
    //     /is potentially unsafe when doing server-side rendering\. Try changing it to/,
    //   ],
    // });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

it.todo('ED-15748: Test is not working properly with checkConsoleErrors');
