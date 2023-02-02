import { BrowserTestCase, Browser } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import {
  fullpage,
  expectToMatchSelection,
  setProseMirrorTextSelection,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { Node as PMNode } from 'prosemirror-model';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';

import {
  buildAdfSingleNodeWithParagraphs,
  keyboardSelectDocFromStart,
  keyboardSelectDocFromEnd,
  buildAdfBlockIsFirstNode,
  keyboardShiftSelect,
} from './__helpers/_blockNodeSelectionTestSuite';
import { Selection } from 'prosemirror-state';
import { ADFEntity } from '@atlaskit/adf-utils/types';

type TestName =
  | '[block-node] Should not prevent extending a selection to the end of the document from the start of the document'
  | '[block-node] Should not prevent extending a selection to the start of the document from the end of the document'
  | 'Click and drag from start to end of document and select [block-node]'
  | 'Extend selection down one line to select [block-node] with shift + arrow down'
  | 'Extend selection up one line to select [block-node] with shift + arrow up'
  | 'Extend selection right two characters to select [block-node] from line above with shift + arrow right'
  | 'Extend selection left two characters to select [block-node] from line below with shift + arrow left'
  | 'Extend a selection from end of the document to the start when [block-node] is the first node'
  | 'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node'
  | 'Extend a selection to the end of the document from start when [block-node] is the last node'
  | 'Click and drag from start of the document to select [block-node] when [block-node] is the last node'
  | "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down";

function isSkippingAllBrowsers(arr: Browser[] | undefined): Boolean {
  if (!Array.isArray(arr)) {
    return false;
  }

  return (
    arr.includes('*') ||
    arr.every((b) => ['safari', 'chrome', 'firefox'].includes(b))
  );
}

function getSuiteBrowserTestCase<ITestName extends string>({
  skipTests,
}: {
  skipTests?: { [key in ITestName]?: Browser[] };
}) {
  function SuiteBrowserTestCase(
    testName: ITestName,
    test: Parameters<typeof BrowserTestCase>[2],
  ) {
    if (skipTests && Array.isArray(skipTests?.[testName])) {
      const skipBrowsers = skipTests[testName];

      if (isSkippingAllBrowsers(skipBrowsers)) {
        return;
      }
    }

    BrowserTestCase(
      testName,
      {
        skip: skipTests?.[testName],
      },
      test,
    );
  }
  return SuiteBrowserTestCase;
}

export async function runBlockNodeSelectionTestSuite({
  nodeName,
  selector = `.ak-editor-${nodeName}`,
  editorOptions,
  adfNode,
  customBeforeEach,
  skipTests,
}: {
  nodeName: string;
  selector?: string;
  editorOptions?: { [key: string]: any };
  adfNode: ADFEntity;
  customBeforeEach?: (page: WebDriverPage) => Promise<void>;
  skipTests?: { [key in TestName]?: Browser[] };
}) {
  if (skipTests) {
    for (const [key, value] of Object.entries(skipTests)) {
      if (isSkippingAllBrowsers(value)) {
        // There are multiple problems when the selection is going through a complex HTML tags
        // Most of them are already fixed on newest ProseMirror View version
        // Today we are using prosemirror-view@1.23.2 and the newest one is 1.29.1
        // Before we write working arounds to resolve selection issues (like this one below)
        // We should update prosemirror-view library
        it.todo(`[${nodeName}] - ${key}`);
      }
    }
  }

  describe(`Block node selection test suite [${nodeName}]: `, () => {
    const getLastPosInDoc = async ({ page }: { page: WebDriverPage }) => {
      const jsonDocument = await page.$eval(editable, getDocFromElement);
      const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
      return Selection.atEnd(pmDocument).$head.pos;
    };

    let lastPosInDoc = 0;

    // These block nodes cannot be selected as a node selection which
    // affects expected selection positions in below tests.
    const nodeAllowsNodeSelection = ![
      'taskList',
      'bulletList',
      'orderedList',
      'blockquote',
    ].includes(nodeName);

    const initEditor = async ({
      client,
      adf,
    }: {
      client: BrowserObject;
      adf: string;
    }): Promise<WebDriverPage> => {
      const page = await goToEditorTestingWDExample(client);

      const props = {
        appearance: fullpage.appearance,
        defaultValue: adf,
        ...editorOptions,
      };

      await mountEditor(page, props, undefined, { clickInEditor: false });
      // clear any modifier keys in chrome
      if (page.isBrowser('chrome')) {
        await page.keys(['NULL']);
      }

      if (customBeforeEach) {
        await customBeforeEach(page);
      }

      await page.waitForSelector(selector);
      // We set the ProseMirror selection to the last
      // valid document position at the start of several
      // tests.
      lastPosInDoc = await getLastPosInDoc({ page });

      await page.waitForIdleBrowser();

      return page;
    };

    const setProseMirrorSelection = async ({
      page,
      selection,
    }: {
      page: WebDriverPage;
      selection: { anchor: number; head: number };
    }) => {
      await setProseMirrorTextSelection(page, selection);
    };

    const SuiteBrowserTestCase = getSuiteBrowserTestCase({ skipTests });
    describe(`[${nodeName}] with a paragraph before and after`, () => {
      SuiteBrowserTestCase(
        '[block-node] Should not prevent extending a selection to the end of the document from the start of the document',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          // In some situations Editor lost its focus
          // or the selection is in a weird state
          // This code below will help us to clean the state
          const anchorSelector = '.ProseMirror > p:first-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: 1, head: 1 },
          });
          await keyboardSelectDocFromStart(page);
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head: lastPosInDoc,
          });
        },
      );

      SuiteBrowserTestCase(
        '[block-node] Should not prevent extending a selection to the start of the document from the end of the document',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          // In some situations Editor lost its focus
          // or the selection is in a weird state
          // This code below will help us to clean the state
          const anchorSelector = '.ProseMirror > p:last-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: lastPosInDoc, head: lastPosInDoc },
          });
          await keyboardSelectDocFromEnd(page);
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: lastPosInDoc,
            head: 1,
          });
        },
      );

      SuiteBrowserTestCase(
        'Click and drag from start to end of document and select [block-node]',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          const anchorSelector = '.ProseMirror > p:first-child';
          const headSelector = '.ProseMirror > p:last-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: 1, head: 1 },
          });
          await page.simulateMouseTextSelection({
            anchorSelector,
            headSelector,
          });
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head: lastPosInDoc,
          });
        },
      );

      SuiteBrowserTestCase(
        'Extend selection down one line to select [block-node] with shift + arrow down',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          const anchorSelector = '.ProseMirror > p:first-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: 1, head: 1 },
          });
          await keyboardShiftSelect({
            page,
            direction: 'Down',
            numberOfTimes: 1,
          });
          const lastParagraphStartsAt = lastPosInDoc - 1;
          // If the node can't be selected as a node selection, move into the
          // first editable position inside the node.
          let head = nodeAllowsNodeSelection ? lastParagraphStartsAt : 5;
          // Some nodes have one less child node compared to other
          // nodes that don't allow node selection.
          if (['taskList', 'blockquote', 'codeBlock'].includes(nodeName)) {
            head = 4;
          }
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head,
          });
        },
      );

      SuiteBrowserTestCase(
        'Extend selection up one line to select [block-node] with shift + arrow up',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          const anchorSelector = '.ProseMirror > p:last-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: lastPosInDoc, head: lastPosInDoc },
          });
          await keyboardShiftSelect({
            page,
            direction: 'Up',
            numberOfTimes: 1,
          });
          const firstParagraphEndsAt = 2;
          // If the node can't be selected as a node selection, move into the
          // first editable position inside the node.
          let head = nodeAllowsNodeSelection ? firstParagraphEndsAt : 5;
          // Some nodes have one less child node compared to other
          // nodes that don't allow node selection.
          if (['taskList', 'blockquote'].includes(nodeName)) {
            head = 4;
          }
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: lastPosInDoc,
            head,
          });
          // This class is only applied when the entire node is within a selection.
          if (nodeAllowsNodeSelection) {
            await page.waitForSelector(`.ak-editor-selected-node`);
          }
        },
      );

      SuiteBrowserTestCase(
        'Extend selection right two characters to select [block-node] from line above with shift + arrow right',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          await setProseMirrorSelection({
            page,
            selection: { anchor: 1, head: 1 },
          });

          await keyboardShiftSelect({
            page,
            direction: 'Right',
            numberOfTimes: 2,
          });

          const lastParagraphStartsAt = lastPosInDoc - 1;
          let head = lastParagraphStartsAt;
          if (['codeBlock'].includes(nodeName)) {
            head = 4;
            // Some nodes have one less child node compared to other
            // nodes that don't allow node selection.
          } else if (['taskList', 'blockquote'].includes(nodeName)) {
            head = lastPosInDoc;
          }

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head,
          });

          // This class is only applied when the entire node is within a selection.
          if (nodeAllowsNodeSelection) {
            await page.waitForSelector(`.ak-editor-selected-node`);
          }
        },
      );

      SuiteBrowserTestCase(
        'Extend selection left two characters to select [block-node] from line below with shift + arrow left',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfSingleNodeWithParagraphs({ adfNode })),
          });
          const anchorSelector = '.ProseMirror > p:last-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: lastPosInDoc, head: lastPosInDoc },
          });

          await keyboardShiftSelect({
            page,
            direction: 'Left',
            numberOfTimes: 2,
          });

          const head = 1;

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: lastPosInDoc,
            head,
          });

          // This class is only applied when the entire node is within a selection.
          if (nodeAllowsNodeSelection) {
            await page.waitForSelector(`.ak-editor-selected-node`);
          }
        },
      );
    });

    describe(`[${nodeName}] is the first node in document`, () => {
      SuiteBrowserTestCase(
        'Extend a selection from end of the document to the start when [block-node] is the first node',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfBlockIsFirstNode({ adfNode })),
          });
          const anchorSelector = '.ProseMirror > p:last-child';

          await page.waitForSelector(anchorSelector);
          const anchorElement = await page.$(anchorSelector);
          const isAnchorClicklable = await anchorElement.isClickable();

          // In some situations, the first node has focus when the ADF is loaded
          // That may cause the floating toolbar to be visible
          // When that happens, Webdriver can't click in the middle of the paragraph
          // So, this is a fallback to click at the element start
          if (isAnchorClicklable) {
            await page.click(anchorSelector);
          } else {
            const anchorElementWidth = await anchorElement.getSize('width');
            await anchorElement.click({ x: -(anchorElementWidth / 2) });
          }

          await setProseMirrorSelection({
            page,
            selection: { anchor: lastPosInDoc, head: lastPosInDoc },
          });

          await keyboardSelectDocFromEnd(page);
          // If the node can't be selected as a node selection, move into the
          // first editable position inside the node.
          let head = nodeAllowsNodeSelection ? 0 : 3;
          // TaskLists and blockquotes have one less child node compared to other
          // nodes that don't allow node selection.
          if (['taskList', 'blockquote'].includes(nodeName)) {
            head = 2;
          }
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: lastPosInDoc,
            head,
          });
        },
      );

      SuiteBrowserTestCase(
        'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfBlockIsFirstNode({ adfNode })),
          });

          const anchorSelector = '.ProseMirror > p:last-child';
          await page.waitForSelector(anchorSelector);
          const anchorElement = await page.$(anchorSelector);
          const isAnchorClicklable = await anchorElement.isClickable();
          // In some situations, the first node has focus when the ADF is loaded
          // That may cause the floating toolbar to be visible
          // When that happens, Webdriver can't click in the middle of the paragraph
          // So, this is a fallback to click at the element start
          if (isAnchorClicklable) {
            await page.click(anchorSelector);
          } else {
            const anchorElementWidth = await anchorElement.getSize('width');
            await anchorElement.click({ x: -(anchorElementWidth / 2) });
          }
          await setProseMirrorSelection({
            page,
            selection: { anchor: lastPosInDoc, head: lastPosInDoc },
          });

          await page.simulateMouseTextSelection({
            anchorSelector,
            headSelector: selector,
          });
          // If the node can't be selected as a node selection, move into the
          // first editable position inside the node.
          let head = nodeAllowsNodeSelection ? 0 : 3;
          // TaskLists and blockquotes have one less child node compared to other
          // nodes that don't allow node selection.
          if (['taskList', 'blockquote'].includes(nodeName)) {
            head = 2;
          }

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: lastPosInDoc,
            head,
          });
        },
      );
    });

    describe(`[${nodeName}] is the last node in document`, () => {
      it.todo(
        `[${nodeName}] - Extend a selection to the end of the document from start when [block-node] is the last node`,
      );
      /*
        SuiteBrowserTestCase(
          'Extend a selection to the end of the document from start when [block-node] is the last node',
          async (client: BrowserObject) => {
            const page = await initEditor({
              client,
              adf: JSON.stringify(buildAdfBlockIsLastNode({ adfNode })),
            });
            await setProseMirrorSelection({
              page,
              selection: { anchor: 1, head: 1 },
            });

            await keyboardSelectDocFromStart(page);
            await expectToMatchSelection(page, {
              type: 'text',
              anchor: 1,
              head: lastPosInDoc,
            });
          },
        );
       */

      it.todo(
        `[${nodeName}] - Click and drag from start of the document to select [block-node] when [block-node] is the last node`,
      );
      /*
      SuiteBrowserTestCase(
        'Click and drag from start of the document to select [block-node] when [block-node] is the last node',
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            adf: JSON.stringify(buildAdfBlockIsLastNode({ adfNode })),
          });

          const anchorSelector = '.ProseMirror > p:first-child';
          await page.click(anchorSelector);
          await setProseMirrorSelection({
            page,
            selection: { anchor: 1, head: 1 },
          });

          await page.simulateMouseTextSelection({
            anchorSelector,
            headSelector: selector,
          });

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head: lastPosInDoc,
          });
        },
      );
     */
    });

    if (nodeAllowsNodeSelection) {
      describe(`Multiple [${nodeName}'s]`, () => {
        it.todo(
          `[${nodeName}] - Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down`,
        );
        /*
        SuiteBrowserTestCase(
          "Extend selection down by one line multiple times to select [block-node]'s in sequence with shift + arrow down",
          async (client: BrowserObject) => {
            const page = await initEditor({
              client,
              adf: JSON.stringify(
                buildAdfMultipleNodesWithParagraphs({ adfNode }),
              ),
            });
            await setProseMirrorSelection({
              page,
              selection: { anchor: 1, head: 1 },
            });

            const nodeSize = await page.execute(() => {
              const view = (window as any).__editorView;
              return view.state.doc.nodeAt(2).nodeSize;
            });

            const expectedSelections: SelectionMatch[] = [
              // The doc for this test looks like the following:
              // doc(
              //  paragraph('{<>}')
              //  node()
              //  node()
              //  node()
              // paragraph('')
              // )
              { type: 'text', anchor: 1, head: 2 },
              { type: 'text', anchor: 1, head: 2 + nodeSize },
              { type: 'text', anchor: 1, head: 2 + nodeSize + nodeSize },
              {
                type: 'text',
                anchor: 1,
                head: lastPosInDoc,
              },
            ];

            for (const selection of expectedSelections) {
              await keyboardShiftSelect({
                page,
                direction: 'Down',
                numberOfTimes: 1,
              });

              await expectToMatchSelection(page, selection);
            }
          },
        );
       */
      });
    }
  });
}
