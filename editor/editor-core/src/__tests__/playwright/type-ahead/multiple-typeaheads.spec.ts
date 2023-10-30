import { editorTestCase as test, expect } from '@af/editor-libra';

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
test.describe('typeahead - multiple typeaheads', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test.use({ adf: onlyOneChar });

  test.describe('when the mention item is inserted from the quick insert typeahead menu', () => {
    test('it should re open the type-ahead with the mention list', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.press('Enter');
      await editor.typeAhead.search('mention');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');

      await expect(editor.typeAhead.mentionsListItems.first()).toBeVisible();
    });
  });

  test.describe('when the emoji item is inserted from the quick insert typeahead menu', () => {
    test('it should re open the type-ahead with the emoji list', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.press('Enter');
      await editor.typeAhead.search('emoji');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');

      await expect(editor.typeAhead.emojisListItems.first()).toBeVisible();
    });
  });
});
