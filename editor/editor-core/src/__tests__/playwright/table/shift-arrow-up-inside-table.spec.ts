import { editorTestCase as test, expect } from '@af/editor-libra';
import { simpleTableAfterParagraph } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTableAfterParagraph,
  platformFeatureFlags: { 'platform.editor.table.shift-arrowup-fix': true },
});

test('Pressing shift + arrow up inside a top table row should select entire table', async ({
  editor,
}) => {
  // Puts cursor in the first cell of the top row
  await editor.selection.set({ anchor: 13, head: 13 });

  await editor.keyboard.press('Shift+ArrowUp');

  await expect(editor).toHaveSelection({
    type: 'cell',
    anchor: 47,
    head: 11,
  });
});
