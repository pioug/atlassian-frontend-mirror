import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  setProseMirrorTextSelection,
  expectToMatchSelection,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  emptyParagraphUnderneathTable,
  emptyParagraphUnderneathTableAtEnd,
  filledParagraphUnderneathTable,
} from './__fixtures__/empty-paragraph-underneath-table';

BrowserTestCase(
  `backspace for an empty paragraph not at the end of the document should delete that paragraph and
  place cursor inside last cell of table`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: emptyParagraphUnderneathTable,
    });

    await setProseMirrorTextSelection(page, { anchor: 45 });
    await page.keys('Backspace');
    await expectToMatchSelection(page, { type: 'text', to: 40, from: 40 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `backspace for an empty paragraph at the end of the document should only
  place cursor inside last cell of table`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: emptyParagraphUnderneathTableAtEnd,
    });

    await setProseMirrorTextSelection(page, { anchor: 45 });
    await page.keys('Backspace');
    await expectToMatchSelection(page, { type: 'text', to: 40, from: 40 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `backspace for an filled paragraph not at the end of the document should
  place cursor inside last cell of table`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: filledParagraphUnderneathTable,
    });

    await setProseMirrorTextSelection(page, { anchor: 45 });
    await page.keys('Backspace');
    await expectToMatchSelection(page, { type: 'text', to: 40, from: 40 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
