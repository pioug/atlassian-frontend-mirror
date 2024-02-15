import {
  EditorMainToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

test.describe('Sticky Toolbar', () => {
  test.use({
    editorProps: {
      appearance: 'comment',
    },
  });
  test('Typeahead popup should be above the sticky toolbar', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await editor.page.setViewportSize({
      width: 1000,
      height: 100,
    });
    await editor.typeAhead.search('');
    const boldButton = await toolbar.menuItemByLabel('Bold');
    await expect(boldButton).not.toBeInSight();
  });
});
