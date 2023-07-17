import {
  EditorNodeContainerModel,
  EditorExpandModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

import {
  expandWithParagraph,
  closedExpand,
  doubleExpand,
} from './selection.spec.ts-fixtures/adf';

test.describe('Selection', () => {
  test.describe('expandWithParagraph', () => {
    test.use({
      adf: expandWithParagraph,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
      },
    });

    test('when the text selection is above the expand, clicking the title input it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const expand = EditorExpandModel.from(nodes.expand);

      // test with selection starting above the expand
      await editor.selection.set({ anchor: 1, head: 1 });
      await expand.clickTitleInput();
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });
    });

    test('when the text selection is below the expand, clicking the title input it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const expand = EditorExpandModel.from(nodes.expand);

      // test with selection starting below the expand
      await editor.selection.set({ anchor: 19, head: 19 });
      await expand.clickTitleInput();
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });
    });

    test('when navigating to the title via the up & down arrow keys, it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      // test with selection starting above the expand
      await editor.selection.set({ anchor: 1, head: 1 });
      await editor.keyboard.press('ArrowDown');
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });

      // test with selection starting below the expand
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await expect(editor).toHaveSelection({
        anchor: 19,
        head: 19,
        type: 'text',
      });

      await editor.keyboard.press('ArrowUp');
      await expect(editor).toHaveSelection({
        anchor: 16,
        head: 16,
        type: 'text',
      });
    });

    test('when navigating to the title via the left & right arrow keys, it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      // test with selection starting at the end of the first paragraph
      await editor.selection.set({ anchor: 10, head: 10 });
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });

      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        pos: 18,
        type: 'gapcursor',
        side: 'right',
      });

      // test with selection starting on the gap cursor after the expand
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });
    });
  });

  test.describe('closedExpand', () => {
    test.use({
      adf: closedExpand,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
      },
    });

    test('when the text selection is above the expand, clicking the title input it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const expand = EditorExpandModel.from(nodes.expand);

      // test with selection starting above the expand
      await editor.selection.set({ anchor: 1, head: 1 });
      await expand.clickTitleInput();
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });
    });

    test('when the text selection is below the expand, clicking the title input it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const expand = EditorExpandModel.from(nodes.expand);

      // test with selection starting below the expand
      await editor.selection.set({ anchor: 16, head: 16 });
      await expand.clickTitleInput();
      await expect(editor).toHaveSelection({
        anchor: 13,
        head: 13,
        type: 'text',
      });
    });
  });

  test.describe('two expands', () => {
    test.use({
      adf: doubleExpand,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
      },
    });

    test('when the text selection is above the expand, clicking the title input it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const expand = EditorExpandModel.from(nodes.expand.first());

      // test with selection starting above the expand
      await editor.selection.set({ anchor: 1, head: 1 });
      await expand.clickTitleInput();
      await expect(editor).toHaveSelection({
        anchor: 587,
        head: 587,
        type: 'text',
      });
    });

    test('when the text selection is below the expand, clicking the title input it should set the selection to the first child text selection', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const expand = EditorExpandModel.from(nodes.expand.first());

      // test with selection starting below the expand
      await editor.selection.set({ anchor: 594, head: 594 });
      await expand.clickTitleInput();
      await expect(editor).toHaveSelection({
        anchor: 587,
        head: 587,
        type: 'text',
      });
    });
  });
});
