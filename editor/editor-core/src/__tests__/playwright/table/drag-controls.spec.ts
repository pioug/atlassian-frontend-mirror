import {
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorTableDragMenu,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import {
  simpleTable,
  simpleTableWithLargeRows,
} from './drag-controls.spec.ts-fixtures';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    featureFlags: {
      'table-drag-and-drop': true,
    },
  },
  adf: simpleTable,
  platformFeatureFlags: {
    'platform.editor.custom-table-width': true,
  },
});

test.describe('drag and drop UI', () => {
  test.describe('row', () => {
    test('should display handle when cell in 3rd row is hovered - row', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdRow = await tableModel.rowDragControls(2);

      const cell = await tableModel.cell(6);
      await cell.hover();

      expect(await thirdRow.isDragHandleVisible()).toBeTruthy();
    });

    test('should open drag menu', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstRow = await tableModel.rowDragControls(0);

      const cell = await tableModel.cell(0);
      await cell.hover();

      const dragMenu = await firstRow.menu(EditorPopupModel.from(editor));

      expect(await dragMenu.isMenuVisible()).toBeTruthy();
    });

    test('should not open drag menu on shift+click', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstRow = await tableModel.rowDragControls(0);

      const cell = await tableModel.cell(0);
      await cell.hover();

      const popup = EditorPopupModel.from(editor);
      const dragMenu = EditorTableDragMenu.from({ popup });

      await firstRow.click({ modifiers: ['Shift'] });

      expect(await dragMenu.isMenuHidden()).toBeTruthy();
    });
  });

  test.describe('column', () => {
    test('should display handle when cell is hovered', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdColumn = await tableModel.columnDragControls(2);

      const cell = await tableModel.cell(2);
      await cell.hover();

      expect(await thirdColumn.isDragHandleVisible()).toBeTruthy();
    });

    test('should open drag menu', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);

      const cell = await tableModel.cell(0);
      await cell.hover();

      const dragMenu = await firstColumn.menu(EditorPopupModel.from(editor));

      expect(await dragMenu.isMenuVisible()).toBeTruthy();
    });

    test('should not open drag menu on shift+click', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);

      const cell = await tableModel.cell(0);
      await cell.hover();

      const popup = EditorPopupModel.from(editor);
      const dragMenu = EditorTableDragMenu.from({ popup });

      await firstColumn.click({ modifiers: ['Shift'] });

      expect(await dragMenu.isMenuHidden()).toBeTruthy();
    });
  });

  test.describe('when clicked on clickable zone', () => {
    test.use({
      adf: simpleTableWithLargeRows,
    });
    test('should select row', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdRow = await tableModel.rowDragControls(2);

      const cell = await tableModel.cell(6);
      await cell.hover();

      await thirdRow.clickClickableZone();

      await expect(editor).toHaveSelection({
        anchor: 78,
        head: 58,
        type: 'cell',
      });
    });

    test('should not open row drag menu', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdRow = await tableModel.rowDragControls(2);

      const cell = await tableModel.cell(6);
      await cell.hover();

      await thirdRow.clickClickableZone();

      const popup = EditorPopupModel.from(editor);
      const dragMenu = EditorTableDragMenu.from({ popup });

      expect(await dragMenu.isMenuHidden()).toBeTruthy();
    });

    test('should select column', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);

      const cell = await tableModel.cell(0);
      await cell.hover();

      await firstColumn.clickClickableZone();

      await expect(editor).toHaveSelection({
        anchor: 58,
        head: 2,
        type: 'cell',
      });
    });

    test('should not open column drag menu', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstColumn = await tableModel.columnDragControls(0);

      const cell = await tableModel.cell(6);
      await cell.hover();

      await firstColumn.clickClickableZone();

      const popup = EditorPopupModel.from(editor);
      const dragMenu = EditorTableDragMenu.from({ popup });

      expect(await dragMenu.isMenuHidden()).toBeTruthy();
    });
  });

  test.describe('when entire table is selected', () => {
    test('should not render any visible drag handles', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstRowDragHandle = await tableModel.rowDragControls(0);
      const firstColumnDragHandle = await tableModel.columnDragControls(0);

      await tableModel.selectTable();

      // a drag handle will always render but the '.placeholder' class ensures it's visibly hidden
      expect(await firstRowDragHandle.isDragHandleVisible()).toBeTruthy();
      expect(await firstRowDragHandle.dragButtonClassList()).toContain(
        'placeholder',
      );

      // a drag handle will always render but the '.placeholder' class ensures it's visibly hidden
      expect(await firstColumnDragHandle.isDragHandleVisible()).toBeTruthy();
      expect(await firstColumnDragHandle.dragButtonClassList()).toContain(
        'placeholder',
      );
    });
  });
});
