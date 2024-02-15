import {
  EditorExtensionModel,
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { tableInsideLayoutAfterExtension } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    allowLayouts: true,
    allowExtension: true,
  },

  editorMountOptions: {
    withConfluenceMacrosExtensionProvider: true,
  },

  adf: tableInsideLayoutAfterExtension,
});

test.describe('when the extension context panel opens', () => {
  test('should not overflow the table', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const extensionModel = EditorExtensionModel.from(nodes.bodiedExtension);
    const tableModel = EditorTableModel.from(nodes.table);

    await editor.selection.set({ anchor: 1, head: 1 });

    await test.step('make sure the table is not overflowed already', async () => {
      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });

    await extensionModel.configuration(editor).openContextPanel();

    expect(await tableModel.hasOverflowed()).toBeFalsy();
  });
});

test('should not overflow the table when changing viewport', async ({
  editor,
}) => {
  const nodes = EditorNodeContainerModel.from(editor);
  const tableModel = EditorTableModel.from(nodes.table);
  await editor.page.setViewportSize({ width: 1000, height: 1024 });
  await editor.selection.set({ anchor: 1, head: 1 });
  await tableModel.isSelected();
  const cell = await tableModel.cell(0);
  await cell.click();
  await cell.resize({
    mouse: editor.page.mouse,
    cellSide: 'right',
    moveDirection: 'right',
    moveDistance: 100,
  });
  await test.step('make sure the table is not overflowed already', async () => {
    expect(await tableModel.hasOverflowed()).toBeFalsy();
  });
  await editor.page.setViewportSize({ width: 1050, height: 1024 });
  await tableModel.isSelected();
  expect(await tableModel.hasOverflowed()).toBeFalsy();
});
