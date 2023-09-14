import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorMainToolbarModel,
  EditorEmojiModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('> ');
    await editor.keyboard.type('some text ');
    await emojiNode.insert({ shortName: 'a' });

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
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);
    await editor.keyboard.type('* ');
    await emojiNode.insert({ shortName: 'smile' });

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
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('1. ');
    await emojiNode.insert({ shortName: 'a' });

    await expect(editor).toMatchDocument(
      doc(
        ol()(li(p(emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(), ' '))),
      ),
    );
  });

  test('should be able remove emoji on backspace', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('this ');
    await emojiNode.insert({ shortName: 'joy' });

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
    fixTest({
      jiraIssueId: 'ED-19277',
      reason:
        'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19277',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const emojiModel = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('<> ');
    await editor.keyboard.type('this ');
    await emojiModel.insertFromToolbar({ shortName: 'smile' });

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
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('this ');
    await emojiNode.insert({ shortName: 'smile' });

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
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('3. ');
    await emojiNode.insert({ shortName: 'a' });

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 3 })(
          li(p(emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(), ' ')),
        ),
      ),
    );
  });
});
