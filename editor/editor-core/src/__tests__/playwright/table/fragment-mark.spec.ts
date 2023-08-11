import {
  EditorTableModel,
  EditorNodeContainerModel,
  EditorExtensionModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { withFragmentMark } from './__fixtures__/with-fragment-mark';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    allowLayouts: true,
    allowBreakout: true,
    allowExtension: {
      allowAutoSave: true,
      allowExtendFloatingToolbars: true,
    },
    allowFragmentMark: true,
  },
  editorMountOptions: {
    withConfluenceMacrosExtensionProvider: true,
  },

  adf: withFragmentMark,
});

test.describe('when fragment mark is applied', () => {
  test('table should go wide when click breakout button', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    await editor.selection.set({ anchor: 1, head: 1 });

    const breakoutButton = await editor.page.locator('[aria-label="Go wide"]');

    await test.step('make sure the table is not overflowed already', async () => {
      expect(await tableModel.containerWidth()).toBe(760);
    });
    await breakoutButton.first().click();

    expect(await tableModel.containerWidth()).toBe(960);
  });

  test('extension should go wide when click breakout button', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    await editor.selection.set({ anchor: 1, head: 1 });

    const extensionModel = EditorExtensionModel.from(nodes.extension);

    await extensionModel.clickTitle();
    const extensionLayoutModel = await extensionModel.layout(editor);

    await test.step('make sure the table is not overflowed already', async () => {
      expect(await extensionModel.containerWidth()).toBe(760);
    });

    await extensionLayoutModel.toWide();

    expect(await extensionModel.containerWidth()).toBe(1011);
  });
});

test.describe('when fragment mark is applied and `platform.editor.custom-table-width` ff is enabled', () => {
  test.use({
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  test('table should resize to correct width when dragging handle larger', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: 100 });

    expect(await tableModel.containerWidth()).toBe(960);
  });

  test('extension should go wide when click breakout button', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    await editor.selection.set({ anchor: 1, head: 1 });

    const extensionModel = EditorExtensionModel.from(nodes.extension);

    await extensionModel.clickTitle();
    const extensionLayoutModel = await extensionModel.layout(editor);

    await test.step('make sure the table is not overflowed already', async () => {
      expect(await extensionModel.containerWidth()).toBe(760);
    });

    await extensionLayoutModel.toWide();

    expect(await extensionModel.containerWidth()).toBe(1011);
  });
});
