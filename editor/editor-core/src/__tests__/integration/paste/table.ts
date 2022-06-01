import type { Browser } from '@atlaskit/webdriver-runner/runner';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

import {
  fullpage,
  setProseMirrorTextSelection,
  getDocFromElement,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { selectors as editorSelectors } from '../../__helpers/page-objects/_editor';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import {
  documentWithTextAndSimpleTable,
  documentWithTextAndComplexTable,
  documentWithSimpleTableAndText,
  documentWithComplexTableAndText,
} from './__fixtures__/document-with-text-and-table';

const testCases: {
  test: string;
  adf: ADFEntity;
  selection: { anchor: number; head: number };
  skipBrowsers: Browser[];
}[] = [
  {
    test:
      'when text and part of simple table is selected, should still paste table',
    adf: documentWithTextAndSimpleTable,
    selection: { anchor: 1, head: 57 },
    skipBrowsers: [],
  },
  {
    test:
      'when text and part of complex table is selected, should still paste table',
    adf: documentWithTextAndComplexTable,
    selection: { anchor: 1, head: 173 },
    // browserstack running on safari times out loading the document
    skipBrowsers: ['safari'],
  },
  {
    test:
      'when part of simple table and text is selected, should still paste table',
    adf: documentWithSimpleTableAndText,
    selection: { anchor: 24, head: 57 },
    skipBrowsers: [],
  },
  {
    test:
      'when part of complex table and text is selected, should still paste table',
    adf: documentWithComplexTableAndText,
    selection: { anchor: 82, head: 198 },
    // browserstack running on safari times out loading the document
    skipBrowsers: ['safari'],
  },
];

testCases.forEach(({ test, adf, selection, skipBrowsers }) => {
  BrowserTestCase(
    `paste - partially selected table: ${test}`,
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

      // select text and part of the table
      await setProseMirrorTextSelection(page, selection);
      await page.copy();

      await page.click(editorSelectors.lastEditorChildParagraph);
      await page.paste();

      // wait for the pasted table to exist
      await page.waitForSelector(
        `.${tableSelectors.tableNodeViewWrapper} ~ .${tableSelectors.tableNodeViewWrapper}`,
      );

      const doc = await page.$eval(editorSelectors.editor, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
