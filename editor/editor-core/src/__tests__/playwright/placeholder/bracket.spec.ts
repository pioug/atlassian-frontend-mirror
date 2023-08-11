import {
  editorTestCase as test,
  expect,
  EditorTitleFocusModel,
  EditorBracketPlaceholderModel,
} from '@af/editor-libra';
import {
  bracketPlaceholder,
  bracketSecondParagraphPlaceholder,
} from './bracket.spec.ts-fixtures';

test.describe('Bracket placeholder', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      placeholderBracketHint: 'LOL BRACKET PLACEHOLDER',
    },
    editorMountOptions: {
      withTitleFocusHandler: true,
    },
  });

  test.describe('and when document is empty', () => {
    test.use({ adf: undefined });

    test('renders placeholder when bracket typed in an empty line', async ({
      editor,
    }) => {
      const placeholderModel = EditorBracketPlaceholderModel.from(editor);

      await editor.keyboard.type('{');

      await expect(placeholderModel.hint).toContainText(
        'LOL BRACKET PLACEHOLDER',
      );
    });

    test('placeholder disappears when content is added to line', async ({
      editor,
    }) => {
      const placeholderModel = EditorBracketPlaceholderModel.from(editor);

      await editor.keyboard.type('{');
      await editor.keyboard.type('Hello world');

      await expect(placeholderModel.hint).toBeHidden();
    });
  });

  test.describe('and when document has a single bracket in the second paragraph', () => {
    test.use({
      adf: bracketSecondParagraphPlaceholder,
    });

    test('renders placeholder after changing selection to line with bracket', async ({
      editor,
    }) => {
      const placeholderModel = EditorBracketPlaceholderModel.from(editor);

      await editor.selection.set({ anchor: 15, head: 15 });

      await expect(placeholderModel.hint).toContainText(
        'LOL BRACKET PLACEHOLDER',
      );
    });

    test('placeholder disappears after changing selection to another line', async ({
      editor,
    }) => {
      const placeholderModel = EditorBracketPlaceholderModel.from(editor);

      await editor.selection.set({ anchor: 15, head: 15 });
      await editor.keyboard.press('ArrowUp');

      await expect(placeholderModel.hint).toBeHidden();
    });
  });

  test.describe('and when document has a single bracket', () => {
    test.use({
      adf: bracketPlaceholder,
    });

    test.describe('when Editor has focus', () => {
      test('should show the placehoder', async ({ editor }) => {
        const placeholderModel = EditorBracketPlaceholderModel.from(editor);
        await editor.selection.set({ anchor: 2, head: 2 });

        await expect(placeholderModel.hint).toContainText(
          'LOL BRACKET PLACEHOLDER',
        );
      });
    });

    test.describe('when Editor does not have focus', () => {
      test('should not show the bracket placehoder', async ({ editor }) => {
        const focusModel = EditorTitleFocusModel.from(editor);
        await focusModel.title.click();

        const placeholderModel = EditorBracketPlaceholderModel.from(editor);

        await expect(placeholderModel.hint).toBeHidden();
      });
    });
  });
});
