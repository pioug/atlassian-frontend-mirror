import {
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import largeListAdf from './large-list-fixtures/bulletlist-99items.adf.json';

test.describe('large unordered lists', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: largeListAdf,
  });

  test('padding should be stable above 100 unordered list items', async ({
    editor,
  }) => {
    const { listItem, list } = EditorNodeContainerModel.from(editor);
    await listItem.last().click();
    await expect(list).toHaveCSS('padding-left', '24px');

    await editor.keyboard.press('Enter');
    await expect(list).toHaveCSS('padding-left', '24px');
  });
});
