import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMainToolbarModel,
  EditorEmojiModel,
} from '@af/editor-libra';
import {
  doc,
  ul,
  ol,
  li,
  emoji,
  blockquote,
  decisionList,
  decisionItem,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('emoji-2', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('should be able to use emoji inside blockquote', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji);

    await editor.keyboard.type('> ');
    await editor.keyboard.type('some text ');
    await editor.keyboard.type(':a:');
    await emojiNode.isVisible('a');
    await expect(editor).toMatchDocument(
      doc(
        blockquote(
          p(
            'some text ',
            emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('should be able to use emoji inside bulletList', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji);
    await editor.keyboard.type('* ');
    await editor.keyboard.type(':smile:');
    await emojiNode.isVisible('smile');

    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(
            p(emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(), ' '),
          ),
        ),
      ),
    );
  });

  test('should be able to use emoji inside orderedList', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji);
    await editor.keyboard.type('1. ');
    await editor.keyboard.type(':a:');
    await emojiNode.isVisible('a');

    await expect(editor).toMatchDocument(
      doc(
        ol()(li(p(emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(), ' '))),
      ),
    );
  });

  test('should be able remove emoji on backspace', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji);

    await editor.keyboard.type('this ');
    await editor.keyboard.type(':joy:');
    await emojiNode.isVisible('joy');

    await expect(editor).toMatchDocument(
      doc(
        p(
          'this ',
          emoji({ shortName: ':joy:', id: '1f602', text: '😂' })(),
          ' ',
        ),
      ),
    );
    await editor.keyboard.press('Backspace');
    await editor.keyboard.press('Backspace');

    await expect(editor).toMatchDocument(doc(p('this ')));
  });

  test('should be able to select emoji by clicking inside decisions', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiModel = EditorEmojiModel.from(nodes.emoji);

    await editor.keyboard.type('<> ');
    await editor.keyboard.type('this ');

    await emojiModel.insertEmojiFromToolbar('smile', editor);

    await expect(editor).toMatchDocument(
      doc(
        decisionList()(
          decisionItem()(
            'this ',
            emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('should be able to change text with emoji into decisions', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji);

    await editor.keyboard.type('this ');
    await editor.keyboard.type(':smile:');
    await emojiNode.isVisible('smile');

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Decision');

    await expect(editor).toMatchDocument(
      doc(
        decisionList()(
          decisionItem()(
            'this ',
            emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(),
            ' ',
          ),
        ),
      ),
    );
  });
});

test.describe('emoji-2: with restartNumberedLists', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      featureFlags: { restartNumberedLists: true },
    },
  });

  test('should be able to use emoji inside orderedList with restartNumberedLists', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji);

    await editor.keyboard.type('3. ');
    await editor.keyboard.type(':a:');
    await emojiNode.isVisible('a');

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 3 })(
          li(p(emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(), ' ')),
        ),
      ),
    );
  });
});
