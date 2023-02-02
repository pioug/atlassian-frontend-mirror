import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  setProseMirrorTextSelection,
  expectToMatchSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { documentWithParagraphAndTable } from './__fixtures__/paragraph-and-table-adf';

const testArrowDown =
  (isNumberedColumnEnabled: boolean) => async (client: any) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: documentWithParagraphAndTable(isNumberedColumnEnabled),
    });

    await setProseMirrorTextSelection(page, { anchor: 5 });
    await page.keys('ArrowDown');
    await expectToMatchSelection(page, { type: 'text', anchor: 10, head: 10 });
  };

// This keyboard navigation is actually browser functionality
// But there was a div on our end that caused a bug where the
// cursor would go behind the table when pressing arrow down
// https://product-fabric.atlassian.net/browse/ED-14046
//
// Skipping in firefox as there is a known bug
// Needs to be fixed in https://product-fabric.atlassian.net/servicedesk/customer/portal/99/DTR-155?created=true
BrowserTestCase(
  'arrow-down-into-table.ts: pressing arrow down above table should move cursor into first row',
  { skip: ['firefox'] },
  testArrowDown(false),
);

BrowserTestCase(
  'arrow-down-into-table.ts: pressing arrow down above table should move cursor into first row for a numbered table',
  { skip: ['firefox'] },
  testArrowDown(true),
);
