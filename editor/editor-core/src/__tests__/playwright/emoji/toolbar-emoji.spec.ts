import {
  EditorEmojiModel,
  EditorEmojiPickerModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  EditorPopupModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, emoji, p } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('toolbar emoji', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('opens emoji picker from toolbar button and inserts', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiModel = EditorEmojiModel.from(nodes.emoji, editor);
    await emojiModel.insertFromToolbar({ shortName: 'smile' });

    await expect(editor).toMatchDocument(
      doc(p(emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(), ' ')),
    );
  });

  test('clicking outside should close the popup', async ({ editor }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Emoji');
    const popup = EditorPopupModel.from(editor);
    const emojiPopup = EditorEmojiPickerModel.from(popup);
    await emojiPopup.toBeVisible();
    await editor.page.mouse.move(0, 0);
    await editor.page.mouse.click(0, 0);
    await expect(emojiPopup.emojiMenuPopUp).toBeHidden();
  });

  test('escape should close the picker', async ({ editor }) => {
    const { keyboard } = editor;
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Emoji');
    const popup = EditorPopupModel.from(editor);
    const emojiPopup = EditorEmojiPickerModel.from(popup);
    await expect(emojiPopup.emojiMenuPopUp).toBeVisible();
    await keyboard.press('Escape');
    await expect(emojiPopup.emojiMenuPopUp).toBeHidden();
  });
});
