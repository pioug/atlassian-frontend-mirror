import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node as PMNode } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { editable, expectToMatchSelection } from '../_helpers';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import {
  selectors,
  getDocFromElement,
  getBoundingRect,
} from '../../__helpers/page-objects/_editor';
import { animationFrame, fullpage } from '../_helpers';

import { adfs } from './__fixtures__/inline-nodes';

const testIt = async (
  client: any,
  testName: string,
  inlineNodeType: string,
) => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    allowStatus: true,
    featureFlags: {
      displayInlineBlockForInlineNodes: true,
    },
    defaultValue: adfs[inlineNodeType],
  });

  const FIRST_LIST_ITEM = '.ProseMirror ul li:nth-child(1)';
  await page.waitForSelector(FIRST_LIST_ITEM);

  // Get the first task item with the status node
  const bounds = await getBoundingRect(page, FIRST_LIST_ITEM);

  // Click after the inline node
  const x = Math.ceil(bounds.width / 2) + 1;
  const y = 1;

  await page.moveTo(FIRST_LIST_ITEM, x, y);
  await page.click();
  await page.keys('Backspace');

  await animationFrame(page);

  const doc = await page.$eval(selectors.editor, getDocFromElement);
  const docNode = PMNode.fromJSON(sampleSchema, doc);

  const listNode = docNode.firstChild;
  const inlineNodes: PMNode[] = [];

  listNode!.descendants((n) => {
    if (!['paragraph', 'text', 'listItem', 'list'].includes(n.type.name)) {
      inlineNodes.push(n);
    }
  });
  expect(inlineNodes).toHaveLength(0);
};

const testSelectLineOfInlineNodes = async (
  client: any,
  testName: string,
  modifierKey: any,
) => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    featureFlags: {
      displayInlineBlockForInlineNodes: true,
    },
    defaultValue: adfs['multipleMentions'],
  });

  await page.click(editable);

  const FIRST_PARAGRAPH = '.ProseMirror p:nth-child(1)';
  await page.waitForSelector(FIRST_PARAGRAPH);

  // Get the first task item with the status node
  const bounds = await getBoundingRect(page, FIRST_PARAGRAPH);

  // Click after the inline node
  const x = Math.ceil(bounds.width * 0.9) + 1;
  const y = 1;

  await page.moveTo(FIRST_PARAGRAPH, x, y);
  await page.click();

  await page.keyboard.type('ArrowLeft', [modifierKey, 'Shift']);

  // @ts-ignore
  await expectToMatchSelection(page, {
    type: 'text',
    anchor: 1,
    head: 4,
  });
};

BrowserTestCase(
  'when the cursor is at the end of the status and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    testIt(client, testName, 'status');
  },
);
BrowserTestCase(
  'when the cursor is at the end of the emoji and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    testIt(client, testName, 'emoji');
  },
);
BrowserTestCase(
  'when the cursor is at the end of the inlineExtension and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    testIt(client, testName, 'inlineExtension');
  },
);
BrowserTestCase(
  'when the cursor is at the end of the mention and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    testIt(client, testName, 'mention');
  },
);
BrowserTestCase(
  'when the cursor is at the end of the date and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    testIt(client, testName, 'date');
  },
);

BrowserTestCase(
  'when cmd + shift + left arrow is pressed after inline nodes, the whole line should be selected in Chrome, Edge & Firefox',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    testSelectLineOfInlineNodes(client, testName, 'Control');
  },
);

BrowserTestCase(
  'when cmd + shift + left arrow is pressed after inline nodes, the whole line should be selected in Safari',
  { skip: ['chrome', 'edge', 'firefox'] },
  async (client: any, testName: string) => {
    testSelectLineOfInlineNodes(client, testName, 'Command');
  },
);
