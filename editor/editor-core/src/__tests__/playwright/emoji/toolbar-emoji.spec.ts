import {
  EditorEmojiModel,
  EditorNodeContainerModel,
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
});
