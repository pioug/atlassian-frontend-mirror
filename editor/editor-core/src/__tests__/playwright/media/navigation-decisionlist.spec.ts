import {
  BROWSERS,
  EditorNodeContainerModel,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';

import {
  decisionListAtEnd,
  decisionListAtMiddle,
  decisionListAtStart,
  multipleDecisionListsAtMiddle,
} from './navigation.spec.ts-fixtures/decisionlist';

const positionAtEnd = (doc: Node) => Selection.atEnd(doc).$head.pos;

const keyboardSelectDocFromStart = () => {
  return process.platform === 'darwin'
    ? 'Meta+Shift+ArrowDown'
    : 'Control+Shift+End';
};

const keyboardSelectDocFromEnd = () => {
  return process.platform === 'darwin'
    ? 'Meta+Shift+ArrowUp'
    : 'Control+Shift+Home';
};

test.describe(`navigation: decisionlist`, () => {
  test.use({
    editorProps: {
      allowTables: {
        advanced: true,
        allowColumnResizing: true,
      },
      appearance: 'full-page',
    },
  });
  test.describe('when decisionlist is the first node', () => {
    test.use({
      adf: decisionListAtStart,
    });
    test(`Extend a selection from end of the document to the start when decisionlist is the first node`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 1,
      });
    });
    test(`Click and drag from the end to start of the document to select decisionlist when decisionlist is the first node`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      const selAtStart = await editor.selection.setAtDocumentStart();
      const selAtEnd = await editor.selection.setAtDocumentEnd();

      await editor.page.mouse.move(
        selAtEnd.cursorCoords!.x,
        selAtEnd.cursorCoords!.y,
      );
      await editor.page.mouse.down();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        selAtStart.cursorCoords!.y,
      );
      await editor.page.mouse.up();
      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 1,
      });
    });
    test(`Extend selection up one line to select decisionlist with shift + arrow up`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 1,
      });
    });
    test(`Extend selection left two characters to select decisionlist from line below with shift + arrow left`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 1,
      });
    });
  });
  test.describe('when decisionlist is in the middle of two paragraphs', () => {
    test.use({
      adf: decisionListAtMiddle,
    });

    test(`should not prevent extending a selection to the end of the document from the start of the document`, async ({
      editor,
    }) => {
      const lastPosInDoc = positionAtEnd(await editor.getProsemirrorDocument());
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.press(keyboardSelectDocFromStart());
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: lastPosInDoc,
      });
    });
    test(`should not prevent extending a selection to the start of the document from the end of the document`, async ({
      editor,
    }) => {
      const lastPosInDoc = positionAtEnd(await editor.getProsemirrorDocument());
      await editor.selection.set({
        anchor: lastPosInDoc,
        head: lastPosInDoc,
      });
      await editor.keyboard.press(keyboardSelectDocFromEnd());
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: lastPosInDoc,
        head: 1,
      });
    });
    test(`click and drag from start to end of document and select node`, async ({
      editor,
    }) => {
      const selAtStart = await editor.selection.setAtDocumentStart();
      const selAtEnd = await editor.selection.setAtDocumentEnd();
      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        selAtStart.cursorCoords!.y,
      );
      await editor.page.mouse.down();
      await editor.page.mouse.move(
        selAtEnd.cursorCoords!.x,
        selAtEnd.cursorCoords!.y,
      );
      await editor.page.mouse.up();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: selAtEnd.position.anchor,
      });
    });
    test(`Extend selection down one line to select decisionlist with shift + arrow down`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 5,
      });
    });
    test(`Extend selection right two characters to select decisionlist from line above with shift + arrow right`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 7,
      });
    });
    test(`Extend selection left two characters to select decisionlist from line below with shift + arrow left`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 7,
        head: 3,
      });
    });
  });
  test.describe('when decisionlist is the last node', () => {
    test.use({
      adf: decisionListAtEnd,
    });

    test(`Extend a selection to the end of the document from start`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 5,
      });
    });

    test(`Click and drag from start of the document to select decisionlist`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'selection issue in webkti',
        browsers: [BROWSERS.webkit],
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const selAtStart = await editor.selection.setAtDocumentStart();

      // use bounding box of the decisionList to form coords for the
      // end location of the mouse up.
      const nodeBox = await nodes.decisionList.first().boundingBox();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        selAtStart.cursorCoords!.y,
      );
      await editor.page.mouse.down();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x, // note forcing vertical selection here
        nodeBox!.y + nodeBox!.height + 100,
      );
      await editor.page.mouse.up();
      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 5,
      });
    });
  });
  test.describe('when multiple decisionlists are middle nodes', () => {
    test.use({
      adf: multipleDecisionListsAtMiddle,
    });
    test(`Extend selection down by one line multiple times to select in sequence with shift + arrow down`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'decisionlist selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 5,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 9,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 13,
      });
    });
  });
});
