import {
  editorTestCase as test,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';
import {
  simpleTableWithTwoParagraphAfter,
  simpleTableWithOneParagraphAfter,
} from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});

test.describe('when document has two paragraph after table', () => {
  test.use({
    adf: simpleTableWithTwoParagraphAfter,
  });

  test('backspace for an empty paragraph not at the end of the document should delete that paragraph and place cursor inside last cell of table', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 40,
      head: 40,
    });
  });
});

test.describe('when document has one paragraph after table', () => {
  test.use({
    adf: simpleTableWithOneParagraphAfter,
  });

  test('backspace for an empty paragraph at the end of the document should only place cursor inside last cell of table', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 40,
      head: 40,
    });
  });

  test('backspace for an filled paragraph not at the end of the document should place cursor inside last cell of table', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.type('Some random text');

    await editor.selection.set({ anchor: 45, head: 45 });

    await editor.keyboard.press('Backspace');
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 40,
      head: 40,
    });
  });
});
