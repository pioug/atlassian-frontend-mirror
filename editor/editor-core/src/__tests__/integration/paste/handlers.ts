import { documentWithListAndTable } from './__fixtures__/document-with-list-and-table';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  fullpage,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

const editorSelector = selectors.editor;

BrowserTestCase(
  'handlers.ts: handleRichText: flatten nested list',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: true,
      defaultValue: JSON.stringify(documentWithListAndTable),
    });
    await page.click(fullpage.placeholder);

    // range selection on nested list item + top-level list item
    await setProseMirrorTextSelection(page, { anchor: 8, head: 16 });
    await page.copy();

    // cursor selection on middle table cell
    await setProseMirrorTextSelection(page, { anchor: 41 });
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
