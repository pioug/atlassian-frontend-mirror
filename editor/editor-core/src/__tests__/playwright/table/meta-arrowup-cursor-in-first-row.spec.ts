import { expect, editorTestCase as test } from '@af/editor-libra';

import { tableAndParagraphAdf } from './meta-arrowup-cursor-in-first-row.spec.ts-fixtures';

test.describe('feature name: libra test', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    adf: tableAndParagraphAdf,
  });

  const moveCursorShortcut =
    process.platform === 'darwin' ? 'Meta+ArrowUp' : 'Control+Home';

  test('meta-arrowup-cursor-in-first-row.ts: pressing command/ctrl + arrow up should move cursor into first row', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 49, head: 49 });

    await editor.keyboard.press(moveCursorShortcut);

    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 4,
      head: 4,
    });
  });
});
