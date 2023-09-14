import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
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
const listStartingFrom0Adf = createListAdf({ order: 0 });
const listStartingFrom1Point9Adf = createListAdf({ order: 1.9 });

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
  'restart-numbered-lists.ts: typing "99." inserts ordered list starting from 99',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, emptyAdf);
    await page.keys([...`99.`.split(''), 'Space']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: typing "0." inserts ordered list starting from 0',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, emptyAdf);
    await page.keys([...`0.`.split(''), 'Space']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: typing "-1." should not insert ordered list',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, emptyAdf);
    await page.keys([...`-1.`.split(''), 'Space']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: typing "99." and extra text and pressing enter should continue incrementing from 99',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, emptyAdf);
    // we use page.keys because windows firefox doesn't execute space chars correctly during page.type
    // (when the space is positioned between other chars) and also suffers issues finding the starting
    // selectors ("element <p> not interactable" errors)
    await page.keys([
      ...`99.`.split(''),
      'Space',
      'a',
      'Enter',
      'b',
      'Enter',
      'c',
      'Enter',
    ]);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: typing "99." above an existing ordered list should join them and start from 99',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom3Adf);
    await page.click(editorSelectors.firstEditorParagraph);
    await page.keys([...`99.`.split(''), 'Space', 'x']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: typing "99." below an existing ordered list should join them and start from the existing list start number',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom3Adf);
    await page.click(editorSelectors.lastEditorChildParagraph);
    await page.keys([...`99.`.split(''), 'Space', 'x']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: splitting a list that starts from 3 (by pressing Enter) should create 2 lists that continue number sequence',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom3Adf);
    // set cursor to end of first list item
    await setProseMirrorTextSelection(page, { anchor: 6 });
    // and then split the list into two
    await page.keys(['Enter', 'Enter']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: splitting a list that starts from 0 (by pressing Enter) should create 2 lists that continue number sequence',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom0Adf);
    // set cursor to end of first list item
    await setProseMirrorTextSelection(page, { anchor: 6 });
    // and then split the list into two
    await page.keys(['Enter', 'Enter']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'restart-numbered-lists.ts: splitting a list that starts from 1.9 (by pressing Enter) should create 2 lists that continue number sequence',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await startEditor(client, listStartingFrom1Point9Adf);
    // set cursor to end of first list item
    await setProseMirrorTextSelection(page, { anchor: 6 });
    // and then split the list into two
    await page.keys(['Enter', 'Enter']);
    // we expect a list of 1.9 and another list starting from 2 (since the browser would
    // render 1.9 as 1)
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
