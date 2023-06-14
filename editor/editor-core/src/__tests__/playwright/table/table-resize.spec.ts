import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { simpleTableWithOneParagraphAfter } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTableWithOneParagraphAfter,
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

test.describe('resizing a table', () => {
  test('handle should be show and hide when hovering', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    // Move selection and mouse away
    await editor.page.mouse.move(100, 600, { steps: 10 });
    await editor.selection.set({ anchor: 45, head: 45 });

    await test.step('resizer handle should not be visible', async () => {
      expect(await resizerModel.isHandleVisible()).toBeFalsy();
    });

    await tableModel.hoverBody();

    await test.step('resizer handle should be visible', async () => {
      expect(await resizerModel.isHandleVisible()).toBeTruthy();
    });
  });

  test('should resize to correct width and centre when dragging handle larger', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: 100 });

    expect(await resizerModel.containerWidth()).toBe(960);
    expect(await resizerModel.containerMarginLeft()).toBe('-100px');
    expect(await tableModel.containerWidth()).toBe(960);
  });

  test('should resize to correct width and centre when dragging handle smaller', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: -100 });

    expect(await resizerModel.containerWidth()).toBe(560);
    expect(await resizerModel.containerMarginLeft()).toBe('100px');
    expect(await tableModel.containerWidth()).toBe(560);
  });
});
