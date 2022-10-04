import type { Browser } from '@atlaskit/webdriver-runner/runner';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

import {
  fullpage,
  setProseMirrorTextSelection,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { selectors as editorSelectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { tableSelectors } from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  documentWithTextAndSimpleTable,
  documentWithTextAndComplexTable,
  documentWithSimpleTableAndText,
  documentWithComplexTableAndText,
  documentWithParagraphsInTableCell,
} from './__fixtures__/document-with-text-and-table';
import Page from '@atlaskit/webdriver-runner/lib/wrapper/wd-wrapper';

const testCases: {
  test: string;
  adf: ADFEntity;
  selection: { anchor: number; head: number };
  skipBrowsers: Browser[];
  selectToPaste: (page: Page) => Promise<void>;
  waitForSelector: string;
}[] = [
  {
    test:
      'when text and part of simple table and text outside is selected, should still paste table',
    adf: documentWithTextAndSimpleTable,
    selection: { anchor: 1, head: 57 },
    selectToPaste: (page: Page) =>
      page.click(editorSelectors.lastEditorChildParagraph),
    waitForSelector: `.${tableSelectors.tableNodeViewWrapper} ~ .${tableSelectors.tableNodeViewWrapper}`,
    skipBrowsers: [],
  },
  {
    test:
      'when text and part of complex table and text outside is selected, should still paste table',
    adf: documentWithTextAndComplexTable,
    selection: { anchor: 1, head: 173 },
    selectToPaste: (page: Page) =>
      page.click(editorSelectors.lastEditorChildParagraph),
    waitForSelector: `.${tableSelectors.tableNodeViewWrapper} ~ .${tableSelectors.tableNodeViewWrapper}`,
    skipBrowsers: [],
  },
  {
    test:
      'when part of simple table and text outside is selected, should still paste table',
    adf: documentWithSimpleTableAndText,
    selection: { anchor: 24, head: 57 },
    selectToPaste: (page: Page) =>
      page.click(editorSelectors.lastEditorChildParagraph),
    waitForSelector: `.${tableSelectors.tableNodeViewWrapper} ~ .${tableSelectors.tableNodeViewWrapper}`,
    skipBrowsers: [],
  },
  {
    test:
      'when part of complex table and text outside the table is selected, should still paste table',
    adf: documentWithComplexTableAndText,
    skipBrowsers: [],
    selectToPaste: (page: Page) =>
      page.click(editorSelectors.lastEditorChildParagraph),
    waitForSelector: `.${tableSelectors.tableNodeViewWrapper} ~ .${tableSelectors.tableNodeViewWrapper}`,
    selection: { anchor: 82, head: 198 },
  },
  {
    test:
      "when selecting multiple paragraphs in a table cell, shouldn't paste table",
    adf: documentWithParagraphsInTableCell,
    selection: { anchor: 18, head: 40 },
    selectToPaste: (page: Page) =>
      page.click(editorSelectors.lastEditorChildParagraph),
    waitForSelector: `.${tableSelectors.tableNodeViewWrapper} ~ p ~ p ~ p`,
    skipBrowsers: [],
  },
  {
    test:
      'when selecting multiple paragraphs in a table cell and paste in another cell, should paste only paragraphs',
    adf: documentWithParagraphsInTableCell,
    selection: { anchor: 18, head: 40 },
    selectToPaste: (page: Page) =>
      page.click(
        `.${tableSelectors.tableNodeViewWrapper} table tr:nth-of-type(2) td:nth-of-type(2) p`,
      ),
    waitForSelector: `.${tableSelectors.tableNodeViewWrapper} table tr:nth-of-type(2) td:nth-of-type(2) p ~ p`,
    skipBrowsers: [],
  },
];

testCases.forEach(
  ({ test, adf, selection, skipBrowsers, waitForSelector, selectToPaste }) => {
    BrowserTestCase(
      `copy paste - tables and content: ${test}`,
      { skip: skipBrowsers as Browser[] },
      async (client: any, testName: string) => {
        const page = await goToEditorTestingWDExample(client);

        const cardProviderPromise = Promise.resolve(
          new ConfluenceCardProvider('prod'),
        );

        await mountEditor(page, {
          appearance: fullpage.appearance,
          allowTables: {
            advanced: true,
          },
          allowPanel: true,
          allowExpand: true,
          media: {
            allowMediaSingle: true,
          },
          allowTextAlignment: true,
          smartLinks: {
            provider: cardProviderPromise,
            allowBlockCards: true,
            allowEmbeds: true,
          },
          defaultValue: adf,
        });

        await setProseMirrorTextSelection(page, selection);
        await page.copy();

        await selectToPaste(page);
        await page.paste();

        // wait for the pasted table to exist
        await page.waitForSelector(waitForSelector);

        const doc = await page.$eval(editorSelectors.editor, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  },
);
