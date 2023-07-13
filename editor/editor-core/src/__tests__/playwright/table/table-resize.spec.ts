import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  simpleTableWithOneParagraphAfter,
  nestedTables,
} from './__fixtures__/base-adfs';

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

test.describe('nested table', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowLayouts: true,
      allowExtension: true,
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    },
    adf: nestedTables,
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  const nestedTableSet = [
    {
      name: 'expand',
      index: 0,
      expected: { normalStatus: false, hoverStatus: false },
    },
    {
      name: 'layout',
      index: 1,
      expected: { normalStatus: false, hoverStatus: false },
    },
    {
      name: 'extension',
      index: 2,
      expected: { normalStatus: false, hoverStatus: false },
    },
    {
      name: 'doc',
      index: 3,
      expected: { normalStatus: false, hoverStatus: true },
    },
  ];

  nestedTableSet.forEach(({ name, index, expected }) => {
    test(`inside ${name}:`, async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      let tableLocator = nodes.table.nth(index);
      let tableModel = EditorTableModel.from(tableLocator);
      let resizerModel = tableModel.resizer();

      // Move selection and mouse away
      await editor.page.mouse.move(100, 600, { steps: 10 });
      await editor.selection.set({ anchor: 191, head: 191 });

      await test.step(`isHandleVisible() should return ${expected.normalStatus} in ${name} without hover`, async () => {
        expect(await resizerModel.isHandleVisible()).toBe(
          expected.normalStatus,
        );
      });
      await tableModel.hoverBody();
      await test.step(`isHandleVisible() should return ${expected.hoverStatus} in ${name} when hover`, async () => {
        expect(await resizerModel.isHandleVisible()).toBe(expected.hoverStatus);
      });
    });
  });
});
