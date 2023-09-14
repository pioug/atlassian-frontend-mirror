// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  expectToMatchSelection,
  fullpage,
  getDocFromElement,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

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
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: emptyParagraphUnderneathTable,
    });

    await setProseMirrorTextSelection(page, { anchor: 45 });
    await page.keys('Backspace');
    await expectToMatchSelection(page, { type: 'text', anchor: 40, head: 40 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `backspace for an empty paragraph at the end of the document should only
  place cursor inside last cell of table`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: emptyParagraphUnderneathTableAtEnd,
    });

    await setProseMirrorTextSelection(page, { anchor: 45 });
    await page.keys('Backspace');
    await expectToMatchSelection(page, { type: 'text', anchor: 40, head: 40 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `backspace for an filled paragraph not at the end of the document should
  place cursor inside last cell of table`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {},
      defaultValue: filledParagraphUnderneathTable,
    });

    await setProseMirrorTextSelection(page, { anchor: 45 });
    await page.keys('Backspace');
    await expectToMatchSelection(page, { type: 'text', anchor: 40, head: 40 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
