import { editorTestCase as test, expect } from '@af/editor-libra';
import { akEditorContextPanelWidth } from '@atlaskit/editor-shared-styles';

test.describe('context panel', () => {
  // Must be large enough to use `positionedOverEditorStyle`
  const windowWidth = 2000;

  test.describe('without a context panel', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
      },
      editorMountOptions: {
        withContextPanel: false,
      },
    });
    test('width is the full window width', async ({ editor }) => {
      await editor.page.setViewportSize({ width: windowWidth, height: 1024 });
      const editorContainer = editor.page.locator(
        '.fabric-editor-popup-scroll-parent',
      );
      const width = (await editorContainer.boundingBox())?.width;
      expect(width).toBe(windowWidth);
    });
  });
  test.describe('with a context panel', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
      },
      editorMountOptions: {
        withContextPanel: true,
      },
    });
    test('width is full container minus the context panel', async ({
      editor,
    }) => {
      await editor.page.setViewportSize({ width: windowWidth, height: 1024 });
      // Override the transition property which causes a delay in the width settling
      await editor.page.addStyleTag({
        content: `* {
        transition: none !important;
      }`,
      });
      const editorContainer = editor.page.locator(
        '.fabric-editor-popup-scroll-parent',
      );

      const width = (await editorContainer?.boundingBox())?.width;
      expect(width).toBe(windowWidth - akEditorContextPanelWidth);
    });
  });
});
