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
});

// TODO: ED-14152 Selection bug on Firefox
test.skip(
  ({ browserName }) => browserName === 'firefox',
  '[Skipped in FireFox due to selection bug ED-14152]',
);
test('ED-14152: pressing arrow down above table should move cursor into first row', async ({
  editor,
}) => {
  await editor.selection.set({ anchor: 4, head: 4 });

  await editor.keyboard.press('ArrowDown');

  await expect(editor).toHaveSelection({
    type: 'text',
    anchor: 13,
    head: 13,
  });
});
