import {
  EditorMainToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

test.describe('Toolbar', () => {
  test.use({ viewport: { width: 1280, height: 300 } });

  test('should span entire width', async ({ editor }) => {
    const toolbar = EditorMainToolbarModel.from(editor);

    // Using bounding box width instead of `expect...toHaveCSS('width', ...)`
    // to avoid pixel-perfect comparison, which is a source of flake
    const toolbarBoundingBox = await toolbar.mainToolbar.boundingBox();
    expect(toolbarBoundingBox?.width).toBeGreaterThan(1200);
  });
});
