import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
  clipboardInput,
  copyAsPlaintextButton,
  copyAsHTML,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors as editorSelectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/integration/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

import emptyAdf from './__fixtures__/empty-adf.json';
import { createListAdf } from './__fixtures__/list-starting-from-adf';

const listStartingFrom3Adf = createListAdf({ order: 3 });
const listStartingFrom2Point9Adf = createListAdf({ order: 2.9 });

const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adf,
    featureFlags: {
      restartNumberedLists: true,
    },
  });
  return page;
};

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (Editor to Editor) copy pasting a list starting from 3 should paste a list starting from 3',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom3Adf);

    // copy the existing numbered list (the starts from 3)
    await setProseMirrorTextSelection(page, { anchor: 5, head: 11 });
    await page.copy();

    // add some space, then paste the copied list
    await page.click(editorSelectors.lastEditorChildParagraph);
    await page.keys('Enter');
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (Editor to Editor) copy pasting a list starting from 2.9 should paste a list starting from 2',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom2Point9Adf);

    // copy the existing numbered list (the starts from 2.9)
    await setProseMirrorTextSelection(page, { anchor: 5, head: 11 });
    await page.copy();

    // add some space, then paste the copied list
    await page.click(editorSelectors.lastEditorChildParagraph);
    await page.keys('Enter');
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (Plain text markdown to Editor) pasting a list starting from 99 should paste a list starting from 99',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, emptyAdf);

    // copy plain text/markdown list starting from 99 to clipboard
    await page.waitFor(clipboardInput);
    await page.type(clipboardInput, `99. a\n100. b\n101. c`);
    await page.click(copyAsPlaintextButton);

    // paste the copied list
    await page.click(editorSelectors.firstEditorParagraph);
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (Plain text markdown to Editor) pasting a list starting from -3 should not paste a list',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, emptyAdf);

    // copy plain text/markdown list starting from negative numbers to clipboard
    await page.waitFor(clipboardInput);
    await page.type(clipboardInput, `-3. a\n-2. b\n-1. c`);
    await page.click(copyAsPlaintextButton);

    // paste the copied list
    await page.click(editorSelectors.firstEditorParagraph);
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (HTML to Editor) pasting a list starting from 33 should paste a list starting from 33',
  { skip: [] },
  async (client: any, testName: string) => {
    let page = await startEditor(client, emptyAdf);

    const html = `<ol start="33"><li>x</li><li>x</li><li>x</li></ol>`;
    await copyAsHTML(page, html);

    page = await startEditor(client, emptyAdf);
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (HTML to Editor) pasting a list with no start number should paste a list starting from 1',
  { skip: [] },
  async (client: any, testName: string) => {
    let page = await startEditor(client, emptyAdf);

    const html = `<ol><li>x</li><li>x</li><li>x</li></ol>`;
    await copyAsHTML(page, html);

    page = await startEditor(client, emptyAdf);
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists-copy-paste.ts: (Microsoft Word Online HTML to Editor) pasting a list starting from 99 should paste a list starting from 99',
  { skip: [] },
  async (client: any, testName: string) => {
    let page = await startEditor(client, emptyAdf);

    // simplified version of Word 365 HTML numbered list, as the original html causes copyAsHTML/paste() in webdriver to hang
    const html = `<div><ol role="list" start="99"><li role="listitem"><p><span><span>A</span></span><span></span></p></li></ol></div><div><ol role="list" start="100"><li><p><span><span>B</span></span><span></span></p></li></ol></div>`;
    await copyAsHTML(page, html);

    page = await startEditor(client, emptyAdf);
    await page.paste();

    // we expect each list item to become an ordered list, because Word HTML nests each <ol> inside a <div>
    // and we currently don't unroll/parse away that structure (so we end up with <ol start=99 /><ol start="100"/>...)
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
