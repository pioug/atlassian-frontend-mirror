import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { emptyParagraphUnderneathTable } from '../../../../__tests__/integration/table/__fixtures__/empty-paragraph-underneath-table';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  tableSelectors,
  clickFirstCell,
  setTableLayoutWide,
} from '@atlaskit/editor-test-helpers/page-objects/table';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'copying table row preserves original table attributes',
  { skip: [] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      // Loading 2 paragraphs beneath table, as we want to avoid the click being blocked by the button beneath the table.
      defaultValue: emptyParagraphUnderneathTable,
    });

    await setTableLayoutWide(page);

    await clickFirstCell(page);

    await page.waitForSelector(tableSelectors.rowControlSelector);
    await page.click(tableSelectors.rowControlSelector);
    await page.copy();

    await page.click(selectors.lastEditorChildParagraph);

    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
