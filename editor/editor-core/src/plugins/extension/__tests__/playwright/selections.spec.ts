import {
  EditorNodeContainerModel,
  EditorExtensionModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { bodiedExtensionWithTextBeforeAndAfter } from './selection.spec.ts-fixtures/adf';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowExtension: true,
  },
  adf: bodiedExtensionWithTextBeforeAndAfter,
});

test.describe('When the node is selected', () => {
  test('[shift + arrow left] Extend the selection up to select last character of text above', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

    await extensionModel.clickTitle();

    await editor.keyboard.press('Shift+ArrowLeft');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 5,
      anchor: 16,
    });
  });

  test('[shift + arrow up] Extend the selection up one line to select entire text above', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

    await extensionModel.clickTitle();

    await editor.keyboard.press('Shift+ArrowUp');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 1,
      anchor: 16,
    });
  });

  test('[shift + arrow right] Extend the selection down one line to select first character of text below', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

    await extensionModel.clickTitle();

    await editor.keyboard.press('Shift+ArrowRight');

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 6,
      head: 17,
    });
  });

  test('[shift + arrow down] Extend the selection down one line to select entire text below', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);

    await extensionModel.clickTitle();

    await editor.keyboard.press('Shift+ArrowDown');

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 6,
      head: 19,
    });
  });
});

test.describe('When the selection is at the start of the text inside the node', () => {
  test('[shift + arrow left] Extend the selection up to select last character of text above', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.keyboard.press('Shift+ArrowLeft');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 5,
      anchor: 16,
    });
  });

  test('[shift + arrow up] Extend the selection up one line to select entire text above', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.keyboard.press('Shift+ArrowUp');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 1,
      anchor: 16,
    });
  });

  test('[shift + arrow right] The first character of the text inside the node is selected', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.keyboard.press('Shift+ArrowRight');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 10,
      anchor: 9,
    });
  });

  test('[shift + arrow down] Extend the selection down one line to select entire text below', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.keyboard.press('Shift+ArrowDown');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 19,
      anchor: 6,
    });
  });
});

test.describe('When the selection is at the end of the text inside the node', () => {
  test('[shift + arrow left] The last character of the text inside the node is selected', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 13, head: 13 });
    await editor.keyboard.press('Shift+ArrowLeft');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 12,
      anchor: 13,
    });
  });

  test('[shift + arrow up] Extend the selection up one line to select entire text above', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 13, head: 13 });
    await editor.keyboard.press('Shift+ArrowUp');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 1,
      anchor: 16,
    });
  });

  test('[shift + arrow right] Extend the selection up to select first character of text below', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 13, head: 13 });
    await editor.keyboard.press('Shift+ArrowRight');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 17,
      anchor: 6,
    });
  });

  test('[shift + arrow down] Extend the selection down one line to select entire text below', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 13, head: 13 });
    await editor.keyboard.press('Shift+ArrowDown');

    await expect(editor).toHaveSelection({
      type: 'text',
      head: 19,
      anchor: 6,
    });
  });
});
