import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { basicTableAdf } from './horizontal-scroll-shadow.spec.ts-fixtures';

test.describe('table: horizontal scroll shadow', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    adf: basicTableAdf,
  });

  test('Table does not show horizontal scroll shadows when there is no scrollbar', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    await expect(tableModel.leftShadow).toBeHidden();
    await expect(tableModel.rightShadow).toBeHidden();
  });

  test('Table shows right shadow when table is scrollable and all the way to the left', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: 1000,
    });

    await expect(tableModel.leftShadow).toBeHidden();
    await expect(tableModel.rightShadow).toBeVisible();
  });

  test('Table should show both left and right shadows when table is scrollable and scrolled', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: 1000,
    });

    await tableModel.scrollTable(editor, 500);
    await expect(tableModel.leftShadow).toBeVisible();
    await expect(tableModel.rightShadow).toBeVisible();
  });

  test('Table should not show right shadow when table is scrollable and scrolled all the way to the right', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const cell = await tableModel.cell(1);
    await cell.click();
    await cell.resize({
      mouse: editor.page.mouse,
      cellSide: 'right',
      moveDirection: 'right',
      moveDistance: 1000,
    });
    await tableModel.scrollTable(editor, 1000);
    await expect(tableModel.leftShadow).toBeVisible();
    await expect(tableModel.rightShadow).toBeHidden();
  });
});
