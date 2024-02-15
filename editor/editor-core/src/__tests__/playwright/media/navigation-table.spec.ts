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
  multipleTablesAtMiddle,
  tableAtEnd,
  tableAtMiddle,
  tableAtStart,
} from './navigation.spec.ts-fixtures/table';

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

test.describe(`navigation: table`, () => {
  test.use({
    editorProps: {
      allowTables: {
        advanced: true,
        allowColumnResizing: true,
      },
      appearance: 'full-page',
    },
  });
  test.describe('when table is the first node', () => {
    test.use({
      adf: tableAtStart,
    });
    test(`Extend a selection from end of the document to the start when table is the first node`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 45,
        head: 0,
      });
    });
    test(`Click and drag from the end to start of the document to select table when table is the first node`, async ({
      editor,
    }) => {
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
        anchor: 45,
        head: 0,
      });
    });
    test(`Extend selection up one line to select table with shift + arrow up`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 45,
        head: 0,
      });
    });
    test(`Extend selection left two characters to select table from line below with shift + arrow left`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason:
          'selection model goes cell by cell rather than whole table in firefox/webkit',
        browsers: [BROWSERS.firefox, BROWSERS.webkit],
      });
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 45,
        head: 0,
      });
    });
  });

  test.describe('when table is in the middle of two paragraphs', () => {
    test.use({
      adf: tableAtMiddle,
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
    test(`Extend selection down one line to select table with shift + arrow down`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 46,
      });
    });
    test(`Extend selection right two characters to select table from line above with shift + arrow right`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 46,
      });
    });
    test(`Extend selection left two characters to select table from line below with shift + arrow left`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 47,
        head: 1,
      });
    });
  });

  test.describe('when table is the last node', () => {
    test.use({
      adf: tableAtEnd,
    });
    test(`Extend a selection to the end of the document from start`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 46,
      });
    });
    test(`Click and drag from start of the document to select table`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const selAtStart = await editor.selection.setAtDocumentStart();
      // use bounding box of the table to form coords for the
      // end location of the mouse up.
      const nodeBox = await nodes.table.first().boundingBox();

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
        head: 46,
      });
    });
  });

  test.describe('when multiple tables are middle nodes', () => {
    test.use({
      adf: multipleTablesAtMiddle,
    });
    test(`Extend selection down by one line multiple times to select in sequence with shift + arrow down`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 46,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 90,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 134,
      });
    });
  });
});
