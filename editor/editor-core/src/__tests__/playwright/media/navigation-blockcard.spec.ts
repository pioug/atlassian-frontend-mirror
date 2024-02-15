import type { EditorPageInterface } from '@af/editor-libra';
import {
  EditorBlockCardModel,
  EditorEmbedCardFloatingToolbarModel,
  EditorEmbedCardModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import {
  embedCardAndEmptyExpand,
  twoEmbedCards,
} from './navigation.spec.ts-fixtures/block-card';

async function convertEmbedToBlock(
  editor: EditorPageInterface,
  nodes: EditorNodeContainerModel,
): Promise<void> {
  await EditorEmbedCardModel.from(nodes.embedCard.nth(0)).waitForStable();
  await EditorEmbedCardModel.from(nodes.embedCard.nth(0)).click();
  await EditorEmbedCardFloatingToolbarModel.from(editor).waitForStable();
  await EditorEmbedCardFloatingToolbarModel.from(editor).toBlock();
}

test.describe('navigation: blockcard', () => {
  test.use({
    editorProps: {
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
      allowExpand: true,
      appearance: 'full-page',
    },
  });

  test.describe('When blockcard is just above an empty expand, Extend a selection from the end of the document to just inside the blockcard through the empty expand node', () => {
    test.use({
      adf: embedCardAndEmptyExpand,
    });

    test('will select the blockcard', async ({ editor }) => {
      await editor.waitForEditorStable();

      const nodes = EditorNodeContainerModel.from(editor);

      await convertEmbedToBlock(editor, nodes);
      await editor.waitForEditorStable();
      await EditorBlockCardModel.from(nodes.blockCard.nth(0)).waitForStable();

      const selAtEnd = await editor.selection.setAtDocumentEnd();

      await editor.page.mouse.move(
        selAtEnd.cursorCoords!.x,
        selAtEnd.cursorCoords!.y,
      );
      await editor.page.mouse.down();

      // use bounding box of the blockcard to move the cursor inside the blockcard
      const nodeBox = await nodes.blockCard.boundingBox();

      await editor.page.mouse.move(
        selAtEnd.cursorCoords!.x,
        nodeBox!.y + Math.floor(nodeBox!.height / 2),
      );

      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 8,
        head: 2,
      });
    });
  });

  test.describe('When there are two or more blockcards, Extend a selection from the start of the document to inside the nth blockcard', () => {
    test.use({
      adf: twoEmbedCards,
    });

    test('will only select that blockcard', async ({ editor }) => {
      await editor.waitForEditorStable();

      const nodes = EditorNodeContainerModel.from(editor);

      await convertEmbedToBlock(editor, nodes);
      await editor.waitForEditorStable();
      await EditorBlockCardModel.from(nodes.blockCard.nth(0)).waitForStable();

      await convertEmbedToBlock(editor, nodes);
      await editor.waitForEditorStable();
      await EditorBlockCardModel.from(nodes.blockCard.nth(1)).waitForStable();

      const selAtStart = await editor.selection.setAtDocumentStart();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        selAtStart.cursorCoords!.y,
      );
      await editor.page.mouse.down();

      // use bounding box of the blockcard to move the cursor inside the blockcard
      const nodeBox1 = await nodes.blockCard.nth(0).boundingBox();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        nodeBox1!.y + Math.floor(nodeBox1!.height / 2),
      );

      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 3,
      });

      const nodeBox2 = await nodes.blockCard.nth(1).boundingBox();

      await editor.page.mouse.move(
        selAtStart.cursorCoords!.x,
        nodeBox2!.y + Math.floor(nodeBox2!.height / 2),
      );

      await editor.waitForEditorStable();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 4,
      });
    });
  });
});
