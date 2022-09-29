import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  animationFrame,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { insertRow } from '@atlaskit/editor-test-helpers/page-objects/table';
import { table as tableInsideLayout } from './__fixtures__/table-inside-layout';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';

BrowserTestCase(
  'Should scale remaining columns when adding a new column preventing from going to overflow',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(tableInsideLayout),
      allowTables: {
        advanced: true,
      },
      allowLayouts: {
        allowBreakout: true,
      },
      allowBreakout: true,
    });

    await clickFirstCell(page);
    await animationFrame(page);
    await animationFrame(page);
    await insertRow(page, 1);
    await page.type(editable, 'should be inside of the table');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
