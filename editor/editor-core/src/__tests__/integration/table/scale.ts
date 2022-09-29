import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  insertColumn,
  deleteColumn,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  tableWithManyMinWidthCols,
  tableInOverflow,
} from './__fixtures__/scale';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

BrowserTestCase(
  'Should scale remaining columns when adding a new column preventing from going to overflow',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableWithManyMinWidthCols),
      allowTables: {
        advanced: true,
      },
    });

    await insertColumn(page, 5, 'left');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should scale remaining columns when deleting a column recovering table from overflow',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableInOverflow),
      allowTables: {
        advanced: true,
      },
    });

    await deleteColumn(page, 1);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
