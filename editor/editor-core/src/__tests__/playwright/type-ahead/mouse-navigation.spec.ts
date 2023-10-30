import { editorTestCase as test, expect } from '@af/editor-libra';

const spaceAtEnd = {
  version: 1,
  type: 'doc',
  content: [
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

test.describe('typeahead - mouse navigation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test.use({ adf: spaceAtEnd });

  test('initial render and then Arrow Down should always highlight the second item', async ({
    editor,
  }) => {
    await editor.selection.set({
      anchor: 1,
      head: 1,
    });

    await editor.typeAhead.search('');

    await expect(editor.typeAhead.itemSelected).not.toHaveAttribute(
      'aria-label',
      'Mention',
    );

    await editor.keyboard.press('ArrowDown');

    await expect(editor.typeAhead.itemSelected).toHaveAttribute(
      'aria-label',
      'Mention',
    );
  });
});
