import {
  EditorNodeContainerModel,
  EditorTableModel,
  EditorFloatingToolbarModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  simpleTable,
  documentWithMergedCells,
  basicTableWithMergedCell,
} from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
      allowColumnSorting: true,
      allowDistributeColumns: true,
    },
  },
  adf: simpleTable,
});

test.describe('Floating toolbar', () => {
  test.describe('Document with simple table', () => {
    test('should floating toolbar context menu sit above other context menu layers', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );

      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // Get the z-index style value of the delete icon popup
      const deleteButtonZindex = await tableModel.getDeleteButtonZindex();

      // Get the z-index style value of the table floating toolbar context menu
      const floatingTablePopupZIndex =
        await floatingToolbarModel.getFloatingTablePopupZIndex();

      // // Floating toolbar context menu should sit above the popup
      expect(floatingTablePopupZIndex).toBeGreaterThan(deleteButtonZindex);
    });

    test('should show hover indicators on delete columns menu option', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );

      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // Hover on the "Delete column" menu option on the context menu
      const deleteColButton = await floatingToolbarModel.getButton(
        'Delete column',
      );
      await deleteColButton.hover();

      const hoverCellsCount = await tableModel.hoveredCellsCount(
        'pm-table-hovered-cell',
        'pm-table-hovered-column',
      );

      expect(hoverCellsCount).toBe(3);
    });

    test('should show hover indicators on delete rows menu option', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );

      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // Hover on the "Delete row" menu option on the context menu
      const deleteRowButton = await floatingToolbarModel.getButton(
        'Delete row',
      );
      await deleteRowButton.hover();

      const hoverCellsCount = await tableModel.hoveredCellsCount(
        'pm-table-hovered-cell',
        'pm-table-hovered-row',
      );

      expect(hoverCellsCount).toBe(3);
    });

    test('should the context menu disabled item stay open when clicked.', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );

      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // Hover on the "Merge Cell" menu option on the context menu (which should be disabled)
      const mergeCellsMenuItem = await floatingToolbarModel.getButton(
        'Merge cells',
      );

      expect(await mergeCellsMenuItem.getAttribute('disabled')).not.toBeNull();

      // Forced click because disabled button cannot be clicked with actionability check on.
      // eslint-disable-next-line playwright/no-force-option
      await mergeCellsMenuItem.click({ force: true });

      // The context menu should remains open, thus the menu item should still be visible
      expect(await mergeCellsMenuItem.isVisible()).toBe(true);
    });
  });

  test.describe('Document with Merged cells', () => {
    test.use({
      allowTables: {
        allowColumnSorting: true,
        allowDistributeColumns: true,
      },
      adf: documentWithMergedCells,
    });

    test('should show tooltip on hover on disabled sort button then remove it on mouse out', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );

      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // No tooltip is shown
      await expect(await floatingToolbarModel.getToolTip()).toBeHidden();

      // Expect there are 2 sort column tooltip menu option
      expect(await floatingToolbarModel.getSortColumnButtonsCount()).toBe(2);

      // Hover Sort column A -> Z button then it should show tooltip, and should be removed after mouseout
      const sortAtoZButton = await floatingToolbarModel.getButton(
        'Sort column A → Z',
      );
      await sortAtoZButton.hover();
      await expect(await floatingToolbarModel.getToolTip()).toBeVisible();
      await floatingToolbarModel.hoverCellOptionMenuItem();
      await expect(await floatingToolbarModel.getToolTip()).toBeHidden();

      // Hover Sort column Z -> A button then it should show tooltip, and should be removed after mouseout
      const sortZtoAButton = await floatingToolbarModel.getButton(
        'Sort column Z → A',
      );
      await sortZtoAButton.hover();
      await expect(await floatingToolbarModel.getToolTip()).toBeVisible();
      await floatingToolbarModel.hoverCellOptionMenuItem();
      await expect(await floatingToolbarModel.getToolTip()).toBeHidden();
    });
  });

  test.describe('Document with basic table and merged cells', () => {
    test.use({
      adf: basicTableWithMergedCell,
    });

    test('should show yellow highlight on the megred rows when hover disabled sort column ASC menu option', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );
      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // Hover on the "Sort column ASC" menu option on the context menu
      const sortAtoZButton = await floatingToolbarModel.getButton(
        'Sort column A → Z',
      );
      await sortAtoZButton.hover();

      // Check there the yellow highlight background on the merged cells.
      const highlightedCellCount = await tableModel.highlightedCellsCount();
      expect(highlightedCellCount).toBe(1);
    });

    test('should show yellow highlight on the megred rows when hover disabled sort column DESC menu option', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        tableModel,
      );
      // Click "Cell Options", which brings up another context menu
      await floatingToolbarModel.toggleCellOptionMenuItem();

      // Hover on the "Sort column DESC" menu option on the context menu
      const sortZtoAButton = await floatingToolbarModel.getButton(
        'Sort column Z → A',
      );
      await sortZtoAButton.hover();

      // Check there the yellow highlight background on the merged cells.
      const highlightedCellCount = await tableModel.highlightedCellsCount();
      expect(highlightedCellCount).toBe(1);
    });
  });
});
