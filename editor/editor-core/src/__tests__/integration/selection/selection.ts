// eslint-disable-next-line import/no-extraneous-dependencies
import type { BrowserObject } from 'webdriverio';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { SelectionMatch } from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  expectToMatchSelection,
  fullpage,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import blockNodesAdf from './__fixtures__/block-react-node-views.adf.json';
import selectionAdf from './__fixtures__/selectable-nodes-adf.json';

const rightArrowExpectedSelections: SelectionMatch[] = [
  // panel
  { type: 'gapcursor', pos: 3, side: 'left' },
  { type: 'node', anchor: 3 },
  { type: 'text', anchor: 5 },
  { type: 'text', anchor: 6 },
  { type: 'node', anchor: 3 },
  { type: 'gapcursor', pos: 8, side: 'right' },

  // layout
  { type: 'gapcursor', pos: 8, side: 'left' },
  { type: 'node', anchor: 8 },

  // nested code block
  { type: 'gapcursor', pos: 10, side: 'left' },
  { type: 'node', anchor: 10 },
  { type: 'text', anchor: 11 },
  { type: 'text', anchor: 12 },
  { type: 'node', anchor: 10 },
  { type: 'gapcursor', pos: 13, side: 'right' },

  // nested panel
  { type: 'gapcursor', pos: 13, side: 'left' },
  { type: 'node', anchor: 13 },
  { type: 'text', anchor: 15 },
  { type: 'node', anchor: 15 },
  { type: 'text', anchor: 16 },
  { type: 'node', anchor: 13 },
  { type: 'gapcursor', pos: 18, side: 'right' },

  // layout
  { type: 'text', anchor: 21 },
  { type: 'node', anchor: 8 },
  { type: 'gapcursor', pos: 24, side: 'right' },
];

const leftArrowExpectedSelections: SelectionMatch[] = [
  // layout
  { type: 'gapcursor', pos: 24, side: 'right' },
  { type: 'node', anchor: 8 },
  { type: 'text', anchor: 21 },

  // nested panel
  { type: 'gapcursor', pos: 18, side: 'right' },
  { type: 'node', anchor: 13 },
  { type: 'text', anchor: 16 },
  { type: 'node', anchor: 15 },
  { type: 'text', anchor: 15 },
  { type: 'node', anchor: 13 },
  { type: 'gapcursor', pos: 13, side: 'left' },

  // nested code block
  { type: 'gapcursor', pos: 13, side: 'right' },
  { type: 'node', anchor: 10 },
  { type: 'text', anchor: 12 },
  { type: 'text', anchor: 11 },
  { type: 'node', anchor: 10 },
  { type: 'gapcursor', pos: 10, side: 'left' },

  // layout
  { type: 'node', anchor: 8 },
  { type: 'gapcursor', pos: 8, side: 'left' },

  // panel
  { type: 'gapcursor', pos: 8, side: 'right' },
  { type: 'node', anchor: 3 },
  { type: 'text', anchor: 6 },
  { type: 'text', anchor: 5 },
  { type: 'node', anchor: 3 },
  { type: 'gapcursor', pos: 3, side: 'left' },
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
      { type: 'gapcursor', pos: 24, side: 'left' },
      { type: 'node', anchor: 25 },
      { type: 'text', anchor: 26 },
      { type: 'text', anchor: 27 },
      { type: 'node', anchor: 25 },
      { type: 'node', anchor: 28 },

      { type: 'text', anchor: 29 },
      { type: 'node', anchor: 28 },
      { type: 'gapcursor', pos: 31, side: 'right' },
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
      { type: 'gapcursor', pos: 31, side: 'right' },
      { type: 'node', anchor: 28 },
      { type: 'text', anchor: 29 },
      { type: 'node', anchor: 28 },
      { type: 'node', anchor: 25 },
      { type: 'text', anchor: 27 },
      { type: 'text', anchor: 26 },
      { type: 'node', anchor: 25 },
      { type: 'gapcursor', pos: 24, side: 'left' },

      ...leftArrowExpectedSelections,
    ];

    for (const selection of expectedSelections) {
      await page.keys(['ArrowLeft']);
      await expectToMatchSelection(page, selection);
    }
  },
);

it.todo(
  '[Firefox] - selection: shift + arrowup selection for block react node views',
);
BrowserTestCase(
  'selection: shift + arrowup selection for block react node views',
  { skip: ['firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, blockNodesAdf, { anchor: 60 });

    const expectedSelections: SelectionMatch[] = [
      // bodiedExtension inside the selection
      { type: 'text', anchor: 60, head: 55 },
      // empty paragraph inside the selection
      { type: 'text', anchor: 60, head: 54 },
      // extension inside the selection
      { type: 'text', anchor: 60, head: 52 },
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

it.todo(
  '[Safari] - selection: shift + arrowdown selection for block react node views',
);
BrowserTestCase(
  'selection: shift + arrowdown selection for block react node views',
  { skip: ['safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await initEditor(page, blockNodesAdf, { anchor: 1 });

    const expectedSelections: SelectionMatch[] = [
      // table inside the selection
      { type: 'text', anchor: 1, head: 50 },
      // extension inside the selection
      { type: 'text', anchor: 1, head: 53 },
      // bodiedExtension inside the selection
      { type: 'text', anchor: 1, head: 59 },
      // last paragragh inside the selection
      { type: 'text', anchor: 1, head: 60 },
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
