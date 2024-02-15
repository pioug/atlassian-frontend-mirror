import {
  BROWSERS,
  EditorEmbedCardModel,
  EditorNodeContainerModel,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';

import {
  embedCardAtEnd,
  embedCardAtMiddle,
  embedCardAtStart,
  multipleEmbedCardsAtMiddle,
} from './navigation.spec.ts-fixtures/embed-card';

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

test.describe(`navigation: embedcard`, () => {
  test.use({
    editorProps: {
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
      appearance: 'full-page',
    },
  });

  test.describe('when embedcard is the first node', () => {
    test.use({
      adf: embedCardAtStart,
    });
    test(`Extend a selection from end of the document to the start when embedcard is the first node`, async ({
      editor,
    }) => {
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 0,
      });
    });
    test(`Click and drag from the end to start of the document to select embedcard when embedcard is the first node`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'browser selection issue',
        browsers: [BROWSERS.firefox, BROWSERS.webkit],
      });
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      const selAtStart = await editor.selection.setAtDocumentStart();
      const selAtEnd = await editor.selection.setAtDocumentEnd();

      await editor.page.mouse.move(
        selAtEnd.cursorCoords!.x,
        selAtEnd.cursorCoords!.y,
      );
      await editor.page.mouse.down();

      await editor.page.mouse.move(
        selAtEnd.cursorCoords!.x,
        selAtStart.cursorCoords!.y,
      );
      await editor.page.mouse.up();
      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 0,
      });
    });
    test(`Extend selection up one line to select embedcard with shift + arrow up`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 0,
      });
    });
    test(`Extend selection left two characters to select embed card from line below with shift + arrow left`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason:
          'selection model goes cell by cell rather than whole embedcard in firefox/webkit',
        browsers: [BROWSERS.firefox, BROWSERS.webkit],
      });
      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 0,
      });
    });
  });

  test.describe('when embedcard is in the middle of two paragraphs', () => {
    test.use({
      adf: embedCardAtMiddle,
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
    test(`Extend selection down one line to select embed card with shift + arrow down`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 3,
      });
    });
    test(`Extend selection right two characters to select embedcard from line above with shift + arrow right`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'browser selection issue on firefox',
        browsers: [BROWSERS.firefox],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 3,
      });
    });
    test(`Extend selection left two characters to select embedcard from line below with shift + arrow left`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      await editor.selection.setAtDocumentEnd();
      await editor.keyboard.press('Shift+ArrowLeft');
      await editor.keyboard.press('Shift+ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 4,
        head: 1,
      });
    });
  });

  test.describe('when embedcard is the last node', () => {
    test.use({
      adf: embedCardAtEnd,
    });

    test(`Extend a selection to the end of the document from start`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 3,
      });
    });

    test(`Click and drag from start of the document to select`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
      await embedCardModel.waitForStable();

      const selAtStart = await editor.selection.setAtDocumentStart();
      // use bounding box of the embedCard to form coords for the
      // end location of the mouse up.
      const nodeBox = await nodes.embedCard.first().boundingBox();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        selAtStart.cursorCoords!.y,
      );
      await editor.page.mouse.down();
      await editor.waitForEditorStable();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x, // note forcing vertical selection here
        nodeBox!.y + nodeBox!.height + 100,
      );
      await editor.waitForEditorStable();
      await editor.page.mouse.up();
      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 3,
      });
    });
  });

  test.describe('when multiple embed cards are middle nodes', () => {
    test.use({
      adf: multipleEmbedCardsAtMiddle,
    });
    test(`Extend selection down by one line multiple times to select in sequence with shift + arrow down`, async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526, ED-20209',
        reason: 'browser selection issue on firefox/webkit',
        browsers: [BROWSERS.firefox, BROWSERS.webkit],
      });

      // force window height to make embedcards load
      await editor.page.setViewportSize({ width: 1080, height: 3000 });

      const nodes = EditorNodeContainerModel.from(editor);
      await EditorEmbedCardModel.from(nodes.embedCard.nth(0)).waitForStable();
      await EditorEmbedCardModel.from(nodes.embedCard.nth(1)).waitForStable();
      await EditorEmbedCardModel.from(nodes.embedCard.nth(2)).waitForStable();

      await editor.selection.setAtDocumentStart();
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 3,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 4,
      });
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 5,
      });
    });
  });
});
