import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  fullpage,
  SelectionMatch,
  expectToMatchSelection,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import selectionAdf from './__fixtures__/selectable-nodes-adf.json';
import selectionAdfNoDecisions from './__fixtures__/selectable-nodes-no-decisions-adf.json';

const rightArrowExpectedSelections: SelectionMatch[] = [
  // panel
  { type: 'gapcursor', from: 3, side: 'left' },
  { type: 'node', from: 3 },
  { type: 'text', from: 5 },
  { type: 'text', from: 6 },
  { type: 'node', from: 3 },
  { type: 'gapcursor', from: 8, side: 'right' },

  // layout
  { type: 'gapcursor', from: 8, side: 'left' },
  { type: 'node', from: 8 },

  // nested code block
  { type: 'gapcursor', from: 10, side: 'left' },
  { type: 'node', from: 10 },
  { type: 'text', from: 11 },
  { type: 'text', from: 12 },
  { type: 'node', from: 10 },
  { type: 'gapcursor', from: 13, side: 'right' },

  // nested panel
  { type: 'gapcursor', from: 13, side: 'left' },
  { type: 'node', from: 13 },
  { type: 'text', from: 15 },
  { type: 'node', from: 15 },
  { type: 'text', from: 16 },
  { type: 'node', from: 13 },
  { type: 'gapcursor', from: 18, side: 'right' },

  // layout
  { type: 'text', from: 21 },
  { type: 'node', from: 8 },
  { type: 'gapcursor', from: 24, side: 'right' },
];

const leftArrowExpectedSelections: SelectionMatch[] = [
  // layout
  { type: 'gapcursor', from: 24, side: 'right' },
  { type: 'node', from: 8 },
  { type: 'text', from: 21 },

  // nested panel
  { type: 'gapcursor', from: 18, side: 'right' },
  { type: 'node', from: 13 },
  { type: 'text', from: 16 },
  { type: 'node', from: 15 },
  { type: 'text', from: 15 },
  { type: 'node', from: 13 },
  { type: 'gapcursor', from: 13, side: 'left' },

  // nested code block
  { type: 'gapcursor', from: 13, side: 'right' },
  { type: 'node', from: 10 },
  { type: 'text', from: 12 },
  { type: 'text', from: 11 },
  { type: 'node', from: 10 },
  { type: 'gapcursor', from: 10, side: 'left' },

  // layout
  { type: 'node', from: 8 },
  { type: 'gapcursor', from: 8, side: 'left' },

  // panel
  { type: 'gapcursor', from: 8, side: 'right' },
  { type: 'node', from: 3 },
  { type: 'text', from: 6 },
  { type: 'text', from: 5 },
  { type: 'node', from: 3 },
  { type: 'gapcursor', from: 3, side: 'left' },
];

const initEditor = async (
  page: WebDriverPage,
  adf: any,
  selection: { anchor: number },
) => {
  await mountEditor(
    page,
    {
      appearance: fullpage.appearance,
      defaultValue: adf,
      allowPanel: true,
      allowLayouts: true,
      allowDate: true,
    },
    undefined,
    // clicking selects the layout node which means setProsemirrorTextSelection doesn't
    // work as it relies on current selection being a TextSelection
    { clickInEditor: false },
  );
  // clicking paragraphs to set selection was causing some flaky/weird results so we do it manually
  await setProseMirrorTextSelection(page, selection);
};

BrowserTestCase(
  'selection: right arrow sets correct selections',
  { skip: ['safari', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, selectionAdf, { anchor: 2 });

    const expectedSelections: SelectionMatch[] = [
      ...rightArrowExpectedSelections,

      // decision list
      { type: 'gapcursor', from: 24, side: 'left' },
      { type: 'node', from: 25 },
      { type: 'text', from: 26 },
      { type: 'text', from: 27 },
      { type: 'node', from: 25 },
      { type: 'node', from: 28 },
      { type: 'text', from: 29 },
      { type: 'node', from: 28 },
      { type: 'gapcursor', from: 31, side: 'right' },
    ];

    for (const selection of expectedSelections) {
      await page.keys(['ArrowRight']);
      await expectToMatchSelection(page, selection);
    }
  },
);

// For unknown reasons safari cannot load adf containing tasks or decisions and hangs when we call window.__mountEditor,
// so we give it its own test with the decisions removed
BrowserTestCase(
  'selection: right arrow sets correct selections',
  { skip: ['chrome', 'firefox', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, selectionAdfNoDecisions, { anchor: 2 });

    for (const selection of rightArrowExpectedSelections) {
      await page.keys(['ArrowRight']);
      await expectToMatchSelection(page, selection);
    }
  },
);

BrowserTestCase(
  'selection: left arrow sets correct selections',
  { skip: ['safari', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, selectionAdf, { anchor: 32 });

    const expectedSelections: SelectionMatch[] = [
      // decision list
      { type: 'gapcursor', from: 31, side: 'right' },
      { type: 'node', from: 28 },
      { type: 'text', from: 29 },
      { type: 'node', from: 28 },
      { type: 'node', from: 25 },
      { type: 'text', from: 27 },
      { type: 'text', from: 26 },
      { type: 'node', from: 25 },
      { type: 'gapcursor', from: 24, side: 'left' },

      ...leftArrowExpectedSelections,
    ];

    for (const selection of expectedSelections) {
      await page.keys(['ArrowLeft']);
      await expectToMatchSelection(page, selection);
    }
  },
);

// For unknown reasons safari cannot load adf containing tasks or decisions and hangs when we call window.__mountEditor,
// so we give it its own test with the decisions removed
BrowserTestCase(
  'selection: left arrow sets correct selections',
  { skip: ['chrome', 'firefox', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, selectionAdfNoDecisions, { anchor: 25 });

    for (const selection of leftArrowExpectedSelections) {
      await page.keys(['ArrowLeft']);
      await expectToMatchSelection(page, selection);
    }
  },
);
