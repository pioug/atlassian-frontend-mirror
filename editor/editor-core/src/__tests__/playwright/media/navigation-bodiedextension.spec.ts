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
  bodiedExtensionAtEnd,
  bodiedExtensionAtMiddle,
  bodiedExtensionAtStart,
  multipleBodiedExtensionsAtMiddle,
} from './navigation.spec.ts-fixtures/bodied-extension';

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

const positionAtEnd = (doc: Node) => Selection.atEnd(doc).$head.pos;

test.describe(`navigation: bodiedextension`, () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: true,
    },
  });
  test.describe('when bodiedExtension is the first node', () => {
    test.use({
      adf: bodiedExtensionAtStart,
    });
    test(`Extend a selection from end of the document to the start when bodiedextension is the first node`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'selection difference on firefox',
        browsers: [BROWSERS.firefox],
      });
      const lastPos = positionAtEnd(await editor.getProsemirrorDocument());
      await editor.selection.set({
        anchor: lastPos,
        head: lastPos,
      });
      await editor.keyboard.press(keyboardSelectDocFromEnd());
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: lastPos,
        head: 0,
      });
    });
    test(`Click and drag from the end to start of the document to select bodiedextension when bodiedextension is the first node`, async ({
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

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 0,
      });
    });
    test(`Extend selection up one line to select bodiedextension with shift + arrow up`, async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 0,
      });
    });
    test(`Extend selection left two characters to select bodiedextension from line below with shift + arrow left`, async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 0,
      });
    });
  });
  test.describe('when bodiedExtension is in the middle of two paragraphs', () => {
    test.use({
      adf: bodiedExtensionAtMiddle,
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
    test(`Extend selection down one line to select bodiedextension with shift + arrow down`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'selection difference on firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 6,
      });
    });
    test(`Extend selection right two characters to select bodiedextension from line above with shift + arrow right`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'selection difference on firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 6,
      });
    });
    test(`Extend selection left two characters to select bodiedextension from line below with shift + arrow left`, async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 4,
        head: 1,
      });
    });
  });
  test.describe('when bodiedExtension is the last node', () => {
    test.use({
      adf: bodiedExtensionAtEnd,
    });
    test(`Extend a selection to the end of the document from start`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 6,
      });
    });
    test(`Click and drag from start of the document to select bodiedExtension`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const selAtStart = await editor.selection.setAtDocumentStart();
      // use bounding box of the bodiedExtension to form coords for the
      // end location of the mouse up.
      const nodeBox = await nodes.bodiedExtension.first().boundingBox();

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
        head: 6,
      });
    });
  });
  test.describe('when multiple bodiedextensions are middle nodes', () => {
    test.use({
      adf: multipleBodiedExtensionsAtMiddle,
    });
    test(`Extend selection down by one line multiple times to select in sequence with shift + arrow down`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'selection issue in firefox',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 6,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 10,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 14,
      });
    });
  });
});
