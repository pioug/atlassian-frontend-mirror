import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  animationFrame,
  getDocFromElement,
  fullpage,
} from '../_helpers';
import { insertRow } from '../../__helpers/page-objects/_table';
import { table as tableInsideLayout } from './__fixtures__/table-inside-layout';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

import { clickFirstCell } from '../../__helpers/page-objects/_table';

// There was a ProseMirror bug in Safari that prevents clicks inside a selected block node,
// which caused the following integration test to fail. This was blocking the layout
// selection feature, so we skipped the test for Safari. Once that bug is fixed, we can
// re-enable the test for Safari.
// - ED-9219 https://product-fabric.atlassian.net/browse/ED-9219
// - GitHub issue https://github.com/ProseMirror/prosemirror/issues/1052
BrowserTestCase(
  'Should scale remaining columns when adding a new column preventing from going to overflow',
  { skip: ['edge', 'safari'] },
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
