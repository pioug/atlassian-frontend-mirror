import { editorTestCase as test, expect } from '@af/editor-libra';
import {
  statusADF,
  dateADF,
  emojiADF,
  inlineExtensionADF,
  mentionADF,
  multipleMentionsADF,
} from './add-cursor-after-inline-node.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc, ul, li } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('Cursor Inline Nodes', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowStatus: true,
    },
  });

  test.describe('Status', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowStatus: true,
      },
      adf: statusADF,
    });
    test('when the cursor is at the end of the status and backspace is pressed the inline node should be deleted', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 4, head: 4 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toMatchDocument(doc(ul(li(p('')), li(p('LOL')))));
    });
  });

  test.describe('Emoji', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowStatus: true,
      },
      adf: emojiADF,
    });
    test('when the cursor is at the end of the emoji and backspace is pressed the inline node should be deleted', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 4, head: 4 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(doc(ul(li(p('')), li(p('LOL')))));
    });
  });
  test.describe('Inline Extension', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowStatus: true,
      },
      adf: inlineExtensionADF,
    });
    test('when the cursor is at the end of the inlineExtension and backspace is pressed the inline node should be deleted', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 4, head: 4 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(doc(ul(li(p('')), li(p('LOL')))));
    });
  });

  test.describe('Mention', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowStatus: true,
      },
      adf: mentionADF,
    });
    test('when the cursor is at the end of the mention and backspace is pressed the inline node should be deleted', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 4, head: 4 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(doc(ul(li(p('')), li(p('LOL')))));
    });
  });
  test.describe('Date', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowStatus: true,
      },
      adf: dateADF,
    });
    test('when the cursor is at the end of the date and backspace is pressed the inline node should be deleted', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 4, head: 4 });
      await editor.keyboard.press('Backspace');
      await expect(editor).toHaveDocument(doc(ul(li(p('')), li(p('LOL')))));
    });
  });

  test.describe('Multiple Inline Nodes', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowStatus: true,
      },
      adf: multipleMentionsADF,
    });

    const shortcut =
      process.platform === 'darwin'
        ? 'Meta+Shift+ArrowLeft'
        : 'Control+Shift+Home';
    test('when (ctrl or command) + shift + (home or arrow left) is pressed after inline nodes, the whole line should be selected', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 5, head: 5 });
      await editor.keyboard.press(shortcut);
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 4,
        head: 1,
      });
    });
  });
});
