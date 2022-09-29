import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  copyAsHTML,
  getDocFromElement,
  fullpage,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { document as documentWithTable } from './__fixtures__/document-with-table';
import { emptyDocument } from './__fixtures__/empty-document';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

const editorSelector = selectors.editor;
const tableSelector = 'tbody tr:first-child th:nth-child(1)';

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting fullwidth code snippet into table',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const fullwidthCodeBlock = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><pre><code>hello there</code></pre></div>`;
    await copyAsHTML(page, fullwidthCodeBlock);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(tableSelector);
    await page.click(tableSelector);
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting full-width code snippet into root of document',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const fullwidthCodeBlock = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><pre><code>hello there</code></pre></div>`;
    await copyAsHTML(page, fullwidthCodeBlock);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(emptyDocument),
      allowTables: {
        advanced: true,
      },
    });

    await page.click(fullpage.placeholder);
    await setProseMirrorTextSelection(page, { anchor: 0, head: 0 });
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting content, normal width and full width code snippet into table',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const fullwidthAndNormalWidthCodeBlock = `<meta charset='utf-8'><p data-pm-slice="1 1 []">hello</p><div class="fabric-editor-breakout-mark" data-mode="full-width"><pre><code></code></pre></div><pre><code></code></pre><p>there</p>`;
    await copyAsHTML(page, fullwidthAndNormalWidthCodeBlock);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithTable),
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(tableSelector);
    await page.click(tableSelector);
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting full width expand into table',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const fullwidthExpand = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div>`;
    await copyAsHTML(page, fullwidthExpand);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithTable),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(tableSelector);
    await page.click(tableSelector);
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting full width expand into root of document',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const fullwidthExpand = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div>`;
    await copyAsHTML(page, fullwidthExpand);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(emptyDocument),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(fullpage.placeholder);
    await setProseMirrorTextSelection(page, { anchor: 0, head: 0 });
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting content, normal width and full width expand into table',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const fullwidthAndNormalWidthExpand = `<meta charset='utf-8'><p data-pm-slice="1 1 []">hello</p><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div><div class="fabric-editor-breakout-mark" data-mode="full-width"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div><p>there</p>`;
    await copyAsHTML(page, fullwidthAndNormalWidthExpand);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithTable),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(tableSelector);
    await page.click(tableSelector);
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'handlePastingBreakoutMarks: pasting full width expand, normal expand, normal code snippet and full width code snippet into table',
  {},
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const mixedWidthCodeBlocksAndExpand = `<meta charset='utf-8'><p data-pm-slice="1 1 []">hello</p><div class="fabric-editor-breakout-mark" data-mode="full-width"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div><pre><code></code></pre><div class="fabric-editor-breakout-mark" data-mode="full-width"><pre><code></code></pre></div><p>there</p>`;
    await copyAsHTML(page, mixedWidthCodeBlocksAndExpand);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithTable),
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(tableSelector);
    await page.click(tableSelector);
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
