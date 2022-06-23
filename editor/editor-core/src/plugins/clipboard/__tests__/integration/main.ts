import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { emptyParagraphUnderneathTable } from '../../../../__tests__/integration/table/__fixtures__/empty-paragraph-underneath-table';
import { selectors } from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  tableSelectors,
  clickFirstCell,
  setTableLayoutWide,
} from '../../../../__tests__/__helpers/page-objects/_table';

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
