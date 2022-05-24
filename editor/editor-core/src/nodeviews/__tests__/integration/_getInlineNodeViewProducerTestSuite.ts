import { BrowserTestCase, Browser } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../__tests__/__helpers/testing-example-helpers';

import {
  fullpage,
  expectToMatchSelection,
  setProseMirrorTextSelection,
  SelectionMatch,
} from '../../../__tests__/integration/_helpers';
import { WebDriverPage } from '../../../__tests__/__helpers/page-objects/_types';

import {
  keyboardSelectLineFromLineEnd,
  clickAndDragSelectLineFromLineEnd,
  keyboardSelectLineFromLineStart,
  buildAdfTrailingSpaces,
  buildAdfNoTrailingSpaces,
  buildAdfMultiline,
} from '../__helpers/_getInlineNodeViewProducer';

const testNames = [
  `Extend a selection to the start of the current line from the current position`,
  `Extend a selection to the end of the current line from the current position`,
  `Can click and drag to extend a selection to the start of the current line from the current position`,
  `Can select [target] nodes with the left arrow key and move across them`,
  `Can select [target] nodes with the right arrow key and move across them`,
  `No trailing spaces: Extend a selection to the start of the current line from the current position`,
  `No trailing spaces: Extend a selection to the end of the current line from the current position`,
  `No trailing spaces: Can click and drag to extend a selection to the start of the current line from the current position`,
  `No trailing spaces: Can select [target] nodes with the left arrow key and move across them`,
  `No trailing spaces: Can select [target] nodes with the right arrow key and move across them`,
  `No trailing spaces: Can insert text directly after the last node view in the same paragraph`,
  `Multiline [target] no trailing spaces: Extend a selection to the start of the current line from the current position`,
  `Multiline [target] no trailing spaces: Can insert text directly after the last node view in the same paragraph`,
] as const;

type TestName = typeof testNames[number];

export async function runInlineNodeViewTestSuite({
  nodeName,
  editorOptions,
  node,
  multiLineNode,
  customBeforeEach,
  skipTests,
}: {
  nodeName: string;
  editorOptions?: { [key: string]: any };
  node: { type: string; attrs: { [key: string]: any } };
  multiLineNode: boolean;
  customBeforeEach?: (page: WebDriverPage) => Promise<void>;
  skipTests?: { [key in TestName]?: Browser[] };
}) {
  let testCaseName: TestName;

  describe(`NodeView Producer test suite [${nodeName}]: `, () => {
    // The ADF is generated by the test suite to enforce a structure
    // where we have three of the same inline node view within a paragraph.
    // Tests that use the LAST_NODE_SELECTOR also wait
    // for the selector to be ready before proceeding.
    const LAST_NODE_SELECTOR = `p .${nodeName}View-content-wrap:nth-child(3)`;

    const initEditor = async ({
      client,
      selection,
      adf,
    }: {
      client: BrowserObject;
      selection: { anchor: number; head: number };
      adf: string;
    }): Promise<WebDriverPage> => {
      const page = await goToEditorTestingWDExample(client);
      // Multiline node tests results in an ADF with a table with a narrow
      // cell to ensure nodes are broken across multiple lines
      const props = {
        appearance: fullpage.appearance,
        defaultValue: adf,
        allowTextAlignment: true,
        allowTables: {
          advanced: true,
        },
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

      await page.waitForSelector(LAST_NODE_SELECTOR);
      // clicking paragraphs to set selection was causing flaky results
      await setProseMirrorTextSelection(page, selection);

      return page;
    };

    describe(`[${nodeName}] with trailing spaces`, () => {
      testCaseName = `Extend a selection to the end of the current line from the current position`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 7, head: 7 },
            adf: JSON.stringify(buildAdfTrailingSpaces({ node })),
          });
          await keyboardSelectLineFromLineEnd(page);
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 7,
            head: 1,
          });
        },
      );

      testCaseName = `Extend a selection to the end of the current line from the current position`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 1, head: 1 },
            adf: JSON.stringify(buildAdfTrailingSpaces({ node })),
          });
          await keyboardSelectLineFromLineStart(page);
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head: 7,
          });
        },
      );

      testCaseName = `Can click and drag to extend a selection to the start of the current line from the current position`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 7, head: 7 },
            adf: JSON.stringify(buildAdfTrailingSpaces({ node })),
          });
          await clickAndDragSelectLineFromLineEnd({
            page,
            selector: LAST_NODE_SELECTOR,
          });
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 7,
            head: 1,
          });
        },
      );

      testCaseName = `Can select [target] nodes with the left arrow key and move across them`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 7, head: 7 },
            adf: JSON.stringify(buildAdfTrailingSpaces({ node })),
          });
          const expectedSelections: SelectionMatch[] = [
            { type: 'text', from: 6 },
            { type: 'node', from: 5 },
            { type: 'text', from: 5 },
            { type: 'text', from: 4 },
            { type: 'node', from: 3 },
            { type: 'text', from: 3 },
            { type: 'text', from: 2 },
            { type: 'node', from: 1 },
            { type: 'text', from: 1 },
          ];
          for (const selection of expectedSelections) {
            await page.keys(['ArrowLeft']);
            await expectToMatchSelection(page, selection);
          }
        },
      );

      testCaseName = `Can select [target] nodes with the right arrow key and move across them`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 1, head: 1 },
            adf: JSON.stringify(buildAdfTrailingSpaces({ node })),
          });
          const expectedSelections: SelectionMatch[] = [
            { type: 'node', from: 1 },
            { type: 'text', from: 2 },
            { type: 'text', from: 3 },
            { type: 'node', from: 3 },
            { type: 'text', from: 4 },
            { type: 'text', from: 5 },
            { type: 'node', from: 5 },
            { type: 'text', from: 6 },
          ];
          for (const selection of expectedSelections) {
            await page.keys(['ArrowRight']);
            await expectToMatchSelection(page, selection);
          }
        },
      );
    });

    describe(`[${nodeName}] with no trailing spaces`, () => {
      testCaseName = `No trailing spaces: Extend a selection to the start of the current line from the current position`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 4, head: 4 },
            adf: JSON.stringify(buildAdfNoTrailingSpaces({ node })),
          });

          await keyboardSelectLineFromLineEnd(page);

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 4,
            head: 1,
          });
        },
      );

      testCaseName = `No trailing spaces: Extend a selection to the end of the current line from the current position`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 1, head: 1 },
            adf: JSON.stringify(buildAdfNoTrailingSpaces({ node })),
          });

          await keyboardSelectLineFromLineStart(page);

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 1,
            head: 4,
          });
        },
      );

      //TODO Fix this test for Chrome
      // Click and drag via the test is currently not working as expected in
      // Chrome for non-multiline nodes however click and drag works
      // when manually testing in the browser
      testCaseName = `No trailing spaces: Can click and drag to extend a selection to the start of the current line from the current position`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests
            ? skipTests[testCaseName]
            : multiLineNode
            ? []
            : ['chrome'],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 4, head: 4 },
            adf: JSON.stringify(buildAdfNoTrailingSpaces({ node })),
          });

          await clickAndDragSelectLineFromLineEnd({
            page,
            selector: LAST_NODE_SELECTOR,
          });

          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 4,
            head: 1,
          });
        },
      );

      testCaseName = `No trailing spaces: Can select [target] nodes with the left arrow key and move across them`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 4, head: 4 },
            adf: JSON.stringify(buildAdfNoTrailingSpaces({ node })),
          });

          const expectedSelections: SelectionMatch[] = [
            { type: 'node', from: 3 },
            { type: 'text', from: 3 },
            { type: 'node', from: 2 },
            { type: 'text', from: 2 },
            { type: 'node', from: 1 },
            { type: 'text', from: 1 },
          ];

          for (const selection of expectedSelections) {
            await page.keys(['ArrowLeft']);
            await expectToMatchSelection(page, selection);
          }
        },
      );

      testCaseName = `No trailing spaces: Can select [target] nodes with the right arrow key and move across them`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 1, head: 1 },
            adf: JSON.stringify(buildAdfNoTrailingSpaces({ node })),
          });

          const expectedSelections: SelectionMatch[] = [
            { type: 'node', from: 1 },
            { type: 'text', from: 2 },
            { type: 'node', from: 2 },
            { type: 'text', from: 3 },
            { type: 'node', from: 3 },
            { type: 'text', from: 4 },
          ];

          for (const selection of expectedSelections) {
            await page.keys(['ArrowRight']);
            await expectToMatchSelection(page, selection);
          }
        },
      );

      testCaseName = `No trailing spaces: Can insert text directly after the last node view in the same paragraph`;
      BrowserTestCase(
        testCaseName,
        {
          skip: skipTests?.[testCaseName],
        },
        async (client: BrowserObject) => {
          const page = await initEditor({
            client,
            selection: { anchor: 4, head: 4 },
            adf: JSON.stringify(buildAdfNoTrailingSpaces({ node })),
          });

          await page.keyboard.type('test', []);

          // See https://product-fabric.atlassian.net/browse/ED-12003
          await expectToMatchSelection(page, {
            type: 'text',
            anchor: 8,
            head: 8,
          });
        },
      );
    });

    if (multiLineNode) {
      describe(`Multiline [${nodeName}] with no trailing spaces`, () => {
        testCaseName = `Multiline [target] no trailing spaces: Extend a selection to the start of the current line from the current position`;
        BrowserTestCase(
          testCaseName,
          {
            skip: skipTests?.[testCaseName],
          },
          async (client: BrowserObject) => {
            const page = await initEditor({
              client,
              selection: { anchor: 7, head: 7 },
              adf: JSON.stringify(buildAdfMultiline({ node })),
            });

            await keyboardSelectLineFromLineEnd(page);

            // Currently, the behaviour for multiline inline node views is to
            // select the last node. This needs to be fixed eventually
            // but for now we just want to test that all multiline inline
            // node views have the same behaviour.
            await expectToMatchSelection(page, {
              type: 'text',
              anchor: 7,
              head: 6,
            });
          },
        );

        testCaseName = `Multiline [target] no trailing spaces: Can insert text directly after the last node view in the same paragraph`;
        BrowserTestCase(
          testCaseName,
          {
            skip: skipTests?.[testCaseName],
          },
          async (client: BrowserObject) => {
            const page = await initEditor({
              client,
              selection: { anchor: 7, head: 7 },
              adf: JSON.stringify(buildAdfMultiline({ node })),
            });

            await page.keyboard.type('test', []);

            await expectToMatchSelection(page, {
              type: 'text',
              anchor: 11,
              head: 11,
            });
          },
        );
      });
    }
  });
}