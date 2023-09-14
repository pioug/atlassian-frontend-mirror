import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  expectToMatchSelection,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  selectors,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  animationFrame,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import { adfs } from './__fixtures__/inline-nodes';

interface nodePositions {
  anchor: number;
  head: number;
}

const testIt = async (
  client: any,
  testName: string,
  inlineNodeType: string,
  nodePositions: nodePositions,
) => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    allowStatus: true,
    defaultValue: adfs[inlineNodeType],
  });

  const FIRST_LIST_ITEM = '.ProseMirror ul li:nth-child(1)';
  await page.waitForSelector(FIRST_LIST_ITEM);

  await setProseMirrorTextSelection(page, {
    anchor: nodePositions.anchor,
    head: nodePositions.head,
  });

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
  selectionKey: any,
  nodePositions: nodePositions,
) => {
  const page = await goToEditorTestingWDExample(client);
  await mountEditor(page, {
    appearance: fullpage.appearance,
    defaultValue: adfs['multipleMentions'],
  });

  const FIRST_PARAGRAPH = '.ProseMirror p:nth-child(1)';
  await page.waitForSelector(FIRST_PARAGRAPH);

  await setProseMirrorTextSelection(page, {
    anchor: nodePositions.anchor,
    head: nodePositions.head,
  });

  await page.selectInDirection(selectionKey);

  // @ts-ignore
  await expectToMatchSelection(page, {
    type: 'text',
    anchor: 4,
    head: 1,
  });
};

BrowserTestCase(
  'when the cursor is at the end of the status and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 4,
      head: 4,
    };
    await testIt(client, testName, 'status', nodePositions);
  },
);
BrowserTestCase(
  'when the cursor is at the end of the emoji and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 4,
      head: 4,
    };
    await testIt(client, testName, 'emoji', nodePositions);
  },
);
BrowserTestCase(
  'when the cursor is at the end of the inlineExtension and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 4,
      head: 4,
    };
    await testIt(client, testName, 'inlineExtension', nodePositions);
  },
);
BrowserTestCase(
  'when the cursor is at the end of the mention and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 4,
      head: 4,
    };
    await testIt(client, testName, 'mention', nodePositions);
  },
);
BrowserTestCase(
  'when the cursor is at the end of the date and backspace is pressed the inline node should be deleted',
  { skip: [] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 4,
      head: 4,
    };
    await testIt(client, testName, 'date', nodePositions);
  },
);

//Windows shortcut ctrl + shift + arrow left doesn't work the same as it does on macOS, equivalent shortcut is ctrl + shift + home
BrowserTestCase(
  'when ctrl + shift + home is pressed after inline nodes, the whole line should be selected in Chrome, Edge & Firefox',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 5,
      head: 5,
    };
    await testSelectLineOfInlineNodes(client, testName, 'Home', nodePositions);
  },
);

BrowserTestCase(
  'when cmd + shift + left arrow is pressed after inline nodes, the whole line should be selected in Safari',
  { skip: ['chrome', 'firefox'] },
  async (client: any, testName: string) => {
    const nodePositions: nodePositions = {
      anchor: 5,
      head: 5,
    };
    await testSelectLineOfInlineNodes(
      client,
      testName,
      'ArrowLeft',
      nodePositions,
    );
  },
);
