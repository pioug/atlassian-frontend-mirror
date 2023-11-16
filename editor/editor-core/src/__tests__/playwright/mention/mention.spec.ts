import {
  editorTestCase as test,
  expect,
  EditorMentionModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  blockquote,
  mention,
  ul,
  li,
  ol,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  code,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('feature name: Mention', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
  });

  test('mention-1.ts: user can see mention inside blockquote', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);

    await editor.keyboard.type('>  blockquote ');
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      doc(
        blockquote(
          p(
            ' blockquote ',
            mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('mention-1.ts: user can see mention inside bulletList', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);

    await editor.keyboard.type('* this ');
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(
        ul(
          li(
            p(
              'this ',
              mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
              ' ',
            ),
          ),
        ),
      ),
    );
  });

  test('mention-1.ts: user can see mention inside orderedList', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await editor.keyboard.type('1. list ');
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(
        ol()(
          li(
            p(
              'list ',
              mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
              ' ',
            ),
          ),
        ),
      ),
    );
  });

  test.describe('when restartNumberedLists is true', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        featureFlags: {
          restartNumberedLists: true,
        },
      },
    });
    test('mention-1.ts: user can see mention inside orderedList with restartNumberedLists', async ({
      editor,
    }) => {
      const mentionModel = EditorMentionModel.from(editor);
      await editor.keyboard.type('1. list ');
      await mentionModel.search('Carolyn');
      await editor.keyboard.press('Enter');
      await expect(editor).toHaveDocument(
        doc(
          ol()(
            li(
              p(
                'list ',
                mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
                ' ',
              ),
            ),
          ),
        ),
      );
    });
  });

  test('mention-1.ts: user can see mention inside decision', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await editor.keyboard.type('<> ');
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await expect(editor).toMatchDocument(
      doc(
        decisionList()(
          decisionItem()(
            mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('mention-1.ts: user can see mention inside action', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await editor.keyboard.type('[] ');
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({})(
            mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('mention-1.ts: user can navigate picker using keyboard', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(
        p(
          mention({ id: '1', text: '@Kaitlyn Prouty', accessLevel: '' })(),
          ' ',
        ),
      ),
    );
  });

  test('mention-2.ts: user should see picker if they type "@"', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('');
    await expect(mentionModel.popup).toBeVisible();
  });

  test('mention-2.ts: text@ should not invoke picker', async ({ editor }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await editor.keyboard.type('text@');
    await expect(mentionModel.popup).toBeHidden();
  });

  test('mention-2.ts: user should be able remove mention on backspace', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await mentionModel.search('Summer');
    await editor.keyboard.press('Enter');
    await mentionModel.search('Amber');
    await editor.keyboard.press('Enter');
    await editor.keyboard.press('Backspace');
    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveDocument(
      doc(
        p(
          mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
          ' ',
          mention({ id: '4', text: '@Summer', accessLevel: '' })(),
          ' ',
        ),
      ),
    );
  });

  test('mention-2.ts: @ <space> should not invoke picker', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('');
    await editor.keyboard.type(' Carolyn');
    await expect(mentionModel.popup).toBeHidden();
  });

  test('mention-2.ts: user should see space after node', async ({ editor }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('Summer');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(p(mention({ id: '4', text: '@Summer', accessLevel: '' })(), ' ')),
    );
  });

  test('mention-2.ts: escape closes picker', async ({ editor }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('');
    await expect(mentionModel.popup).toBeVisible();
    await editor.keyboard.press('Escape');
    await expect(mentionModel.popup).toBeHidden();
  });

  test('mention-2.ts: mouseclick outside picker closes picker', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    await mentionModel.search('');
    await expect(mentionModel.popup).toBeVisible();
    await nodes.paragraph.first().click();
    await expect(mentionModel.popup).toBeHidden();
  });

  test('mention-3.ts: user can click ToolbarMentionPicker and see mention', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const mentionModel = EditorMentionModel.from(editor);
    await toolbar.clickAt('Mention');
    await expect(mentionModel.popup).toBeVisible();
  });

  test('mention-3.ts: should not insert on space if multiple exact nickname match', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20853, ED-20968',
      reason:
        'FIXME: This test was automatically skipped due to failure on 11/11/2023: https://product-fabric.atlassian.net/browse/ED-20853',
      browsers: [BROWSERS.chromium, BROWSERS.webkit],
    });

    const mentionModel = EditorMentionModel.from(editor);
    const pgillLocator = await mentionModel.mentionItemByName('pgill');
    const jjacksonLocator = await mentionModel.mentionItemByName('jjackson');
    await mentionModel.search('gill');
    await expect(pgillLocator).toBeVisible();
    await expect(jjacksonLocator).toBeVisible();
    await editor.keyboard.type(' some ');
    await expect(mentionModel.popup).toBeHidden();
    await editor.keyboard.type('text ');
    await expect(editor).toMatchDocument(doc(p('@gill some text ')));
  });

  test('mention-3.ts: inserted if space on single match', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Space');
    await expect(mentionModel.popup).toBeHidden();
    await editor.keyboard.type('text ');
    await expect(editor).toHaveDocument(
      doc(
        p(mention({ id: '0', text: '@Carolyn', accessLevel: '' })(), ' text '),
      ),
    );
  });

  test('mention-3.ts: user should not see mention inside inline code', async ({
    editor,
  }) => {
    await editor.keyboard.type('`this is inline code ');
    const mentionModel = EditorMentionModel.from(editor);
    await mentionModel.search('Carolyn');
    await editor.keyboard.press('Enter');
    await editor.keyboard.press('Backspace');
    await editor.keyboard.type('`');
    await expect(editor).toHaveDocument(
      doc(p(code('this is inline code @Carolyn'))),
    );
  });

  test('mention-3.ts: user should not see mention inside a code block', async ({
    editor,
  }) => {
    await editor.keyboard.type('```');
    await editor.keyboard.type('this is a codeblock @Caro');
    await editor.keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(code_block()('this is a codeblock @Caro\n')),
    );
  });

  test('mention-3.ts: users with same first name should not be selected if space', async ({
    editor,
  }) => {
    const mentionModel = EditorMentionModel.from(editor);
    const awoodsLocator = await mentionModel.mentionItemByName('awoods');
    const fatimaLocator = await mentionModel.mentionItemByName('Fatima');

    await mentionModel.search('alica');
    await expect(awoodsLocator).toBeVisible();
    await expect(fatimaLocator).toBeVisible();
    await expect(
      await mentionModel.mentionsListItems.count(),
    ).toBeGreaterThanOrEqual(2);
    await editor.keyboard.type(' some ');
    await expect(mentionModel.popup).toBeHidden();
    await editor.keyboard.type('text');
    await expect(editor).toHaveDocument(doc(p('@alica some text')));
  });
});
