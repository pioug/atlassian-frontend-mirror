import {
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, status } from '@atlaskit/editor-test-helpers/doc-builder';

const onlyOneChar = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'C',
        },
      ],
    },
  ],
};

const textAndStatusAtFirstParagraph = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'AAA ',
        },
        {
          type: 'status',
          attrs: {
            text: 'CLICK ME',
            color: 'neutral',
            localId: 'local-id',
            style: '',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
  ],
};

test.describe('typeahead - Editor Focus', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowStatus: true,
    },
  });

  test.use({
    adf: textAndStatusAtFirstParagraph,
  });

  test('it should insert the raw query text in the current selection before the user changes the selection', async ({
    editor,
  }) => {
    const { paragraph } = EditorNodeContainerModel.from(editor);
    await editor.selection.set({
      anchor: 9,
      head: 9,
    });
    await editor.typeAhead.search('heading');

    await paragraph.first().click();
    await expect(editor).toHaveDocument(
      doc(
        p(
          'AAA ',
          status({ text: 'CLICK ME', color: 'neutral', localId: 'local-id' }),
          ' ',
        ),
        p('/heading '),
      ),
    );
  });

  test('it should change the selection with only one click', async ({
    editor,
  }) => {
    const { paragraph } = EditorNodeContainerModel.from(editor);

    await editor.selection.set({
      anchor: 9,
      head: 9,
    });

    await editor.typeAhead.search('heading');
    await paragraph.first().click();
    await editor.keyboard.type('some text');

    await expect(editor).toHaveDocument(
      doc(
        p(
          'AAA ',
          status({ text: 'CLICK ME', color: 'neutral', localId: 'local-id' }),
          ' some text',
        ),
        p('/heading '),
      ),
    );
  });

  test.describe('when document has only one char', () => {
    test.use({
      adf: onlyOneChar,
    });

    test('it should focus on Editor when space is typed right after the trigger', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.type(' ');
      await editor.typeAhead.search('');
      await editor.keyboard.type(' lol');

      await expect(editor).toHaveDocument(doc(p('C / lol')));
    });

    test('it should focus on Editor when Backspace is typed right after the trigger', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.type(' ');
      await editor.typeAhead.search('');
      await editor.keyboard.press('Backspace');
      await editor.keyboard.type('lol');

      await expect(editor).toHaveDocument(doc(p('C lol')));
    });

    test('it should focus on Editor when Escape is typed right after the trigger', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.type(' ');
      await editor.typeAhead.search('');
      await editor.keyboard.press('Escape');
      await editor.keyboard.type('lol');
      await expect(editor).toHaveDocument(doc(p('C /lol')));
    });

    test('it should focus on Editor when Escpae is typed whilst in focus of typeahead', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.type(' ');
      await editor.typeAhead.search('');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Escape');
      await editor.keyboard.type('lol');
      await expect(editor).toHaveDocument(doc(p('C /lol')));
    });

    test.describe('when using keyboard selection shortcuts: COMMAND+SHIFT+ARROW_LEFT', () => {
      const shortcut =
        process.platform === 'darwin'
          ? 'Shift+Meta+ArrowLeft'
          : 'Shift+Control+ArrowLeft';

      test('it should not delete any content', async ({ editor }) => {
        fixTest({
          // TODO: ED-20526 Fill those after merge
          jiraIssueId: 'TBD',
          reason: 'Shortcut is not working on CI',
        });

        await editor.selection.set({
          anchor: 2,
          head: 2,
        });
        await editor.keyboard.type(' ');
        await editor.typeAhead.search('act');

        await editor.keyboard.press(shortcut);

        await expect(editor).toHaveDocument(doc(p('C /act')));
      });
    });

    test.describe('when using keyboard selection shortcuts: COMMAND+a', () => {
      const shortcut = process.platform === 'darwin' ? 'Meta+a' : 'Control+a';

      test('it should not delete any content', async ({ editor }) => {
        fixTest({
          // TODO: ED-20526 Fill those after merge
          jiraIssueId: 'TBD',
          reason: 'The shortcut does not work on Firefox',
          browsers: [BROWSERS.firefox],
        });
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });
        await editor.keyboard.type(' ');
        await editor.typeAhead.search('act');

        await editor.keyboard.press(shortcut);

        await expect(editor).toHaveDocument(doc(p('C /act')));
      });
    });
  });
});
