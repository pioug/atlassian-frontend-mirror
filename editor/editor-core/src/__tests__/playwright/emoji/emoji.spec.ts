import {
  BROWSERS,
  EditorEmojiModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
  fixTest,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockquote,
  code,
  code_block,
  decisionItem,
  decisionList,
  doc,
  emoji,
  h1,
  li,
  ol,
  p,
  taskItem,
  taskList,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('emoji', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('should be able to see emoji if typed the name in full', async ({
    editor,
  }) => {
    await editor.keyboard.type(':grinning:');
    await expect(editor).toMatchDocument(
      doc(
        p(emoji({ shortName: ':grinning:', id: '1f600', text: '😀' })(), ' '),
      ),
    );
  });

  test('should convert :) to emoji', async ({ editor }) => {
    await editor.keyboard.type('# ');
    await editor.keyboard.type('heading ');
    await editor.keyboard.type(':) ');
    await expect(editor).toMatchDocument(
      doc(
        h1(
          'heading ',
          emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
          ' ',
        ),
      ),
    );
  });

  test('user should not be able to see emoji inside inline code', async ({
    editor,
  }) => {
    await editor.keyboard.type('type `');
    await editor.keyboard.type(':a:');
    await editor.keyboard.type('`');
    await expect(editor).toMatchDocument(doc(p('type ', code(':a:'))));
  });

  test('should close emoji picker on Escape', async ({ editor }) => {
    await editor.keyboard.type('this ');
    await editor.keyboard.type(':smile');
    await editor.keyboard.press('Escape');
    await expect(editor).toMatchDocument(doc(p('this :smile')));
  });

  test('should be able to navigate between emojis', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);
    await editor.keyboard.type('this ');
    await emojiNode.search('a');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

    await emojiNode.search('grinning');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.nth(1)).toBeVisible();
    await editor.waitForEditorStable();
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.type('that ');
    await expect(editor).toMatchDocument(
      doc(
        p(
          'this ',
          emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(),
          ' that ',
          emoji({
            shortName: ':grinning:',
            id: '1f600',
            text: '😀',
          })(),
          ' ',
        ),
      ),
    );
  });

  test('should be able to use emoji inside blockquote', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);

    await editor.keyboard.type('> ');
    await editor.keyboard.type('some text ');
    await emojiNode.search('a');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

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
    await emojiNode.search('smile');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

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
    await emojiNode.search('a');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

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
    await emojiNode.search('joy');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

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
    await emojiNode.search('smile');
    await editor.keyboard.type(':');

    await expect(nodes.emoji.first()).toBeVisible();

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

  test('user can navigate typeahead using keyboard', async ({ editor }) => {
    await editor.keyboard.type(':smi');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Tab');
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(p(emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(), ' ')),
    );
  });

  test('should select emoji on return', async ({ editor }) => {
    await editor.keyboard.type(':wink');
    await editor.waitForEditorStable();
    await editor.keyboard.press('Enter');
    await expect(editor).toMatchDocument(
      doc(p(emoji({ shortName: ':wink:', id: '1f609', text: '😉' })(), ' ')),
    );
  });

  test('should render emoji inside codeblock', async ({ editor }) => {
    await editor.keyboard.type('```');
    await editor.waitForEditorStable();
    await editor.keyboard.type(':smile:');
    await expect(editor).toMatchDocument(doc(code_block({})(':smile:')));
  });

  test('should render emoji inside action', async ({ editor }) => {
    await editor.keyboard.type('[] ');
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);
    await emojiNode.search('smile');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        taskList({ localId: 'abc-123' })(
          taskItem({ localId: 'abc-123' })(
            emoji({ shortName: ':smile:', id: '1f604', text: '😄' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('should not show typeahead with text: ', async ({ editor }) => {
    await editor.keyboard.type('text: ');
    const typeAheadLocator = await editor.typeAhead.wrapper;
    await editor.waitForEditorStable();
    await expect(typeAheadLocator).toBeHidden();
  });

  test('":<space>" does not show the picker', async ({ editor }) => {
    await editor.keyboard.type(': ');
    const typeAheadLocator = await editor.typeAhead.wrapper;
    await expect(typeAheadLocator).toBeHidden();
  });

  test('emoji picker should be scrollable', async ({ editor }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Emoji');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    const emojiLocator = await editor.page.locator(
      'span[data-testid="sprite-emoji-:persevere:"]',
    );
    await editor.waitForEditorStable();
    await expect(emojiLocator).toBeVisible();
  });
});

test.describe('With restartNumberedLists', () => {
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
    await emojiNode.search('a');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

    await expect(editor).toMatchDocument(
      doc(
        ol({ order: 3 })(
          li(p(emoji({ shortName: ':a:', id: '1f170', text: '🅰' })(), ' ')),
        ),
      ),
    );
  });
});
