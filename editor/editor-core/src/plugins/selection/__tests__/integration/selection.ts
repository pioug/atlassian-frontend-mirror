import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import type { BrowserObject } from 'webdriverio';
import {
  expectToMatchSelection,
  fullpage,
  SelectionMatch,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import selectionAdf from './__fixtures__/selectable-nodes-adf.json';
import blockNodesAdf from './__fixtures__/block-react-node-views.adf.json';

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
      allowTables: {},
      allowExtension: {},
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
  { skip: [] },
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

BrowserTestCase(
  'selection: left arrow sets correct selections',
  { skip: [] },
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

BrowserTestCase(
  'selection: shift + arrowup selection for block react node views',
  { skip: [] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, blockNodesAdf, { anchor: 60 });

    const expectedSelections: SelectionMatch[] = [
      { type: 'text', from: 54, to: 60 },
      { type: 'text', from: 51, to: 60 },
      { type: 'text', from: 1, to: 60 },
    ];

    for (const selection of expectedSelections) {
      // shift is held down in chrome, not other browsers
      if (page.isBrowser('chrome')) {
        await page.keys(['Shift', 'ArrowUp']);
        await page.keys(['Shift']);
      } else {
        await page.keys(['Shift', 'ArrowUp'], true);
      }
      await expectToMatchSelection(page, selection);
    }
  },
);

BrowserTestCase(
  'selection: shift + arrowdown selection for block react node views',
  { skip: [] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, blockNodesAdf, { anchor: 1 });

    const expectedSelections: SelectionMatch[] = [
      { type: 'text', from: 1, to: 51 },
      { type: 'text', from: 1, to: 54 },
      { type: 'text', from: 1, to: 60 },
    ];

    for (const selection of expectedSelections) {
      // shift is held down in chrome, not other browsers
      if (page.isBrowser('chrome')) {
        await page.keys(['Shift', 'ArrowDown']);
        await page.keys(['Shift']);
      } else {
        await page.keys(['Shift', 'ArrowDown'], true);
      }
      await expectToMatchSelection(page, selection);
    }
  },
);

BrowserTestCase(
  'selection: shift + arrowup selection for entire nodes in react node views',
  { skip: [] },
  async (client: any) => {
    const run = async () => {
      const page = await goToEditorTestingWDExample(client);
      await initEditor(page, selectionAdf, { anchor: 1 });

      // Do shift arrow down
      if (page.isBrowser('chrome')) {
        await page.keys(['Shift', 'ArrowUp']);
        await page.keys(['Shift']);
      } else {
        await page.keys(['Shift', 'ArrowUp'], true);
      }

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if there is a Uncaught exception in the console.log (Only works under chrome)
      if (page.isBrowser('chrome')) {
        const logs = await (client as BrowserObject).getLogs('browser');
        logs.forEach((value: Object) => {
          const { message } = value as { message: string };
          if (
            message.match(
              /Uncaught RangeError: Position ([-]?\d+) out of range/,
            )
          ) {
            throw new Error(message);
          }
        });
      }
    };

    await expect(run()).resolves.not.toThrowError(
      /Uncaught RangeError: Position ([-]?\d+) out of range/,
    );
  },
);

BrowserTestCase(
  'selection: shift + arrowdown selection for entire nodes in react node views',
  { skip: [] },
  async (client: any) => {
    const run = async () => {
      const page = await goToEditorTestingWDExample(client);
      await initEditor(page, selectionAdf, { anchor: 34 });

      // Select All
      await page.selectAll();

      // Shift arrow down
      if (page.isBrowser('chrome')) {
        await page.keys(['Shift', 'ArrowDown']);
        await page.keys(['Shift']);
      } else {
        await page.keys(['Shift', 'ArrowDown'], true);
      }

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if there is a Uncaught exception in the console.log (Only works under chrome)
      if (page.isBrowser('chrome')) {
        const logs = await (client as BrowserObject).getLogs('browser');
        logs.forEach((value: Object) => {
          const { message } = value as { message: string };
          if (
            message.match(
              /Uncaught RangeError: There is no position after the top-level node/,
            )
          ) {
            throw new Error(message);
          }
        });
      }
    };

    await expect(run()).resolves.not.toThrowError(
      /Uncaught RangeError: There is no position after the top-level node/,
    );
  },
);
