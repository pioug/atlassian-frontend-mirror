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
  tableWithMergedCells,
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

// There are differences in how browsers calculate and round sizes of DOM elements.
// These differences can go up to 1px in Chrome and Firefox and up to 2px in Safari
// even when the handle is centered.
// That's why 2px is accepted difference in distance between left and right,
// top and bottom edges of drag handle and its parent cell or selected area.
const HANDLE_CENTERED_THRESHOLD = 2;

test.describe('drag and drop UI', () => {
  test.describe('row', () => {
    test('should display minimised third row handle when cell in that row is hovered', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdRowControls = await tableModel.rowDragControls(2);

      const cell = await tableModel.cell(6);
      await cell.hover();

      const thirdRowHandle = thirdRowControls.dragHandleButton;
      await expect(thirdRowHandle).toBeVisible();
      await expect(thirdRowControls.dragHandleRect).toBeVisible();
      await expect(thirdRowControls.dragHandleRect).toHaveClass(
        /pm-table-drag-handle-minimised/,
      );

      const rowHandleBox = await thirdRowHandle.boundingBox();
      const thirdRow = tableModel.rows.nth(2);
      await expect(thirdRow).toBeVisible();
      const thirdRowBox = await thirdRow.boundingBox();

      const distanceBetweenTopRowEdgeAndTopHandleEdge = Math.round(
        rowHandleBox!.y - thirdRowBox!.y,
      );
      const distanceBetweenBottomRowEdgeAndBottomHandleEdge = Math.round(
        thirdRowBox!.y +
          thirdRowBox!.height -
          (rowHandleBox!.y + rowHandleBox!.height),
      );

      // Checks if the handle is centered vertically.
      expect(
        Math.abs(
          distanceBetweenBottomRowEdgeAndBottomHandleEdge -
            distanceBetweenTopRowEdgeAndTopHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
    });

    test('should display not minimised handle on hover', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdRowControls = await tableModel.rowDragControls(2);

      const cell = await tableModel.cell(6);
      await cell.hover();

      await expect(thirdRowControls.dragHandleButton).toBeVisible();
      await thirdRowControls.hover();
      await expect(thirdRowControls.dragHandleRect).toBeVisible();
      await expect(thirdRowControls.dragHandleRect).not.toHaveClass(
        /pm-table-drag-handle-minimised/,
      );

      const rowHandle = thirdRowControls.dragHandleButton;
      await expect(rowHandle).toBeVisible();
      const rowHandleBox = await rowHandle.boundingBox();

      const thirdRow = tableModel.rows.nth(2);
      await expect(thirdRow).toBeVisible();
      const thirdRowBox = await thirdRow.boundingBox();

      const distanceBetweenTopRowEdgeAndTopHandleEdge = Math.round(
        rowHandleBox!.y - thirdRowBox!.y,
      );
      const distanceBetweenBottomRowEdgeAndBottomHandleEdge = Math.round(
        thirdRowBox!.y +
          thirdRowBox!.height -
          (rowHandleBox!.y + rowHandleBox!.height),
      );

      // Checks if the handle is centered vertically.
      expect(
        Math.abs(
          distanceBetweenBottomRowEdgeAndBottomHandleEdge -
            distanceBetweenTopRowEdgeAndTopHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
    });

    test('should display not minimised selected handle when row is selected', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      // Select cells in the second row
      const firstCellInSecondRow = await tableModel.cell(3);
      await firstCellInSecondRow.click();
      const lastCellInSecondRow = await tableModel.cell(5);
      await lastCellInSecondRow.click({ modifiers: ['Shift'] });

      const secondRowControls = await tableModel.rowDragControls(1);
      const secondRowHandle = secondRowControls.dragHandleButton;
      await expect(secondRowHandle).toBeVisible();
      await expect(secondRowControls.dragHandleRect).toBeVisible();
      await expect(secondRowControls.dragHandleRect).not.toHaveClass(
        /pm-table-drag-handle-minimised/,
      );
      expect(await secondRowControls.dragButtonClassList()).toContain(
        'selected',
      );

      const rowHandleBox = await secondRowHandle.boundingBox();
      const secondRow = tableModel.rows.nth(1);
      await expect(secondRow).toBeVisible();
      const secondRowBox = await secondRow.boundingBox();

      const distanceBetweenTopRowEdgeAndTopHandleEdge = Math.round(
        rowHandleBox!.y - secondRowBox!.y,
      );
      const distanceBetweenBottomRowEdgeAndBottomHandleEdge = Math.round(
        secondRowBox!.y +
          secondRowBox!.height -
          (rowHandleBox!.y + rowHandleBox!.height),
      );

      // Checks if the handle is centered vertically.
      expect(
        Math.abs(
          distanceBetweenBottomRowEdgeAndBottomHandleEdge -
            distanceBetweenTopRowEdgeAndTopHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
    });

    test('should display not mimimised selected handle when multiple rows are selected', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      // Select second and third rows
      const firstCellInSecondRow = await tableModel.cell(3);
      await firstCellInSecondRow.click();
      const lastCellInThirdRow = await tableModel.cell(8);
      await lastCellInThirdRow.click({ modifiers: ['Shift'] });

      const secondRowControls = await tableModel.rowDragControls(1);
      const secondRowHandle = secondRowControls.dragHandleButton;
      await expect(secondRowHandle).toBeVisible();
      await expect(secondRowControls.dragHandleRect).toBeVisible();
      await expect(secondRowControls.dragHandleRect).not.toHaveClass(
        /pm-table-drag-handle-minimised/,
      );
      expect(await secondRowControls.dragButtonClassList()).toContain(
        'selected',
      );

      const rowHandleBox = await secondRowHandle.boundingBox();
      const secondRow = tableModel.rows.nth(1);
      await expect(secondRow).toBeVisible();
      const secondRowBox = await secondRow.boundingBox();

      const thirdRow = tableModel.rows.nth(2);
      await expect(thirdRow).toBeVisible();
      const thirdRowBox = await thirdRow.boundingBox();

      const distanceBetweenTopEdgeOfSelectedAreaAndTopHandleEdge = Math.round(
        rowHandleBox!.y - secondRowBox!.y,
      );
      const distanceBetweenBottomEdgeOfSelectedAreaAndBottomHandleEdge =
        Math.round(
          thirdRowBox!.y +
            thirdRowBox!.height -
            (rowHandleBox!.y + rowHandleBox!.height),
        );

      // Checks if the handle is centered vertically.
      expect(
        Math.abs(
          distanceBetweenBottomEdgeOfSelectedAreaAndBottomHandleEdge -
            distanceBetweenTopEdgeOfSelectedAreaAndTopHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
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
    test('should display minimised column handle when cell in the column is hovered', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdColumnControls = await tableModel.columnDragControls(2);

      const secondCellInThirdColumn = await tableModel.cell(5);
      await secondCellInThirdColumn.hover();

      const thirdColumnHandle = thirdColumnControls.dragHandleButton;
      await expect(thirdColumnHandle).toBeVisible();
      await expect(thirdColumnControls.dragHandleRect).toBeVisible();
      await expect(thirdColumnControls.dragHandleRect).toHaveClass(
        /pm-table-drag-handle-minimised/,
      );

      const columnHandleBox = await thirdColumnHandle.boundingBox();
      const firstCellBoxInThirdColBox =
        await secondCellInThirdColumn.getBoundingBox();

      const distanceBetweenLeftColumnEdgeAndLeftHandleEdge = Math.round(
        columnHandleBox!.x - firstCellBoxInThirdColBox!.x,
      );
      const distanceBetweenRightColumnEdgeAndRightHandleEdge = Math.round(
        firstCellBoxInThirdColBox!.x +
          firstCellBoxInThirdColBox!.width -
          (columnHandleBox!.x + columnHandleBox!.width),
      );

      // Checks if the handle is centered horizontally.
      expect(
        Math.abs(
          distanceBetweenRightColumnEdgeAndRightHandleEdge -
            distanceBetweenLeftColumnEdgeAndLeftHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
    });

    test('should display not minimised handle on hover', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const thirdColumnControls = await tableModel.columnDragControls(2);

      const cell = await tableModel.cell(2);
      await cell.hover();

      await expect(thirdColumnControls.dragHandleButton).toBeVisible();
      await thirdColumnControls.hover();
      await expect(thirdColumnControls.dragHandleRect).toBeVisible();
      await expect(thirdColumnControls.dragHandleRect).not.toHaveClass(
        /pm-table-drag-handle-minimised/,
      );

      const columnHandle = thirdColumnControls.dragHandleButton;
      await expect(columnHandle).toBeVisible();
      const columnHandleBox = await columnHandle.boundingBox();

      const firstCellBoxInThirdColBox = await cell.getBoundingBox();

      const distanceBetweenLeftColumnEdgeAndLeftHandleEdge = Math.round(
        columnHandleBox!.x - firstCellBoxInThirdColBox!.x,
      );
      const distanceBetweenRightColumnEdgeAndRightHandleEdge = Math.round(
        firstCellBoxInThirdColBox!.x +
          firstCellBoxInThirdColBox!.width -
          (columnHandleBox!.x + columnHandleBox!.width),
      );

      // Checks if the handle is centered horizontally.
      expect(
        Math.abs(
          distanceBetweenRightColumnEdgeAndRightHandleEdge -
            distanceBetweenLeftColumnEdgeAndLeftHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
    });

    test('should display not minimised selected handle when column is selected', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      // Select cells in the second column
      const firstCellInSecondColumn = await tableModel.cell(1);
      await firstCellInSecondColumn.click();
      const lastCellInSecondColumn = await tableModel.cell(7);
      await lastCellInSecondColumn.click({ modifiers: ['Shift'] });

      const secondColumnControls = await tableModel.columnDragControls(1);

      const secondColumnHandle = secondColumnControls.dragHandleButton;
      await expect(secondColumnHandle).toBeVisible();
      await expect(secondColumnControls.dragHandleRect).toBeVisible();
      await expect(secondColumnControls.dragHandleRect).not.toHaveClass(
        /pm-table-drag-handle-minimised/,
      );
      expect(await secondColumnControls.dragButtonClassList()).toContain(
        'selected',
      );

      const columnHandleBox = await secondColumnHandle.boundingBox();
      const cellBox = await firstCellInSecondColumn.getBoundingBox();

      const distanceBetweenLeftColumnEdgeAndLeftHandleEdge = Math.round(
        columnHandleBox!.x - cellBox!.x,
      );
      const distanceBetweenRightColumnEdgeAndRightHandleEdge = Math.round(
        cellBox!.x +
          cellBox!.width -
          (columnHandleBox!.x + columnHandleBox!.width),
      );

      // Checks if the handle is centered horizontally.
      expect(
        Math.abs(
          distanceBetweenRightColumnEdgeAndRightHandleEdge -
            distanceBetweenLeftColumnEdgeAndLeftHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
    });

    test('should display not minimised selected handle when multiple columns are selected', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      // Select cells in the last two columns
      const firstCellInSecondColumn = await tableModel.cell(1);
      await firstCellInSecondColumn.click();
      const lastCellInThirdColumn = await tableModel.cell(8);
      await lastCellInThirdColumn.click({ modifiers: ['Shift'] });

      const secondColumnControls = await tableModel.columnDragControls(1);
      const secondColumnHandle = secondColumnControls.dragHandleButton;
      await expect(secondColumnHandle).toBeVisible();
      await expect(secondColumnControls.dragHandleRect).toBeVisible();
      await expect(secondColumnControls.dragHandleRect).not.toHaveClass(
        /pm-table-drag-handle-minimised/,
      );
      expect(await secondColumnControls.dragButtonClassList()).toContain(
        'selected',
      );

      const columnHandleBox = await secondColumnHandle.boundingBox();
      const boxOfFirstCellInFirstColumnInSelection =
        await firstCellInSecondColumn.getBoundingBox();
      const boxOfFirstCellInLastColumnInSelection = await (
        await tableModel.cell(2)
      ).getBoundingBox();

      const distanceBetweenLeftEdgeOfSelectedAreaAndLeftHandleEdge = Math.round(
        columnHandleBox!.x - boxOfFirstCellInFirstColumnInSelection!.x,
      );
      const distanceBetweenRightEdgeOfSelectedAreaAndRightHandleEdge =
        Math.round(
          boxOfFirstCellInLastColumnInSelection!.x +
            boxOfFirstCellInLastColumnInSelection!.width -
            (columnHandleBox!.x + columnHandleBox!.width),
        );

      // Checks if the handle is centered horizontally.
      expect(
        Math.abs(
          distanceBetweenRightEdgeOfSelectedAreaAndRightHandleEdge -
            distanceBetweenLeftEdgeOfSelectedAreaAndLeftHandleEdge,
        ),
      ).toBeLessThanOrEqual(HANDLE_CENTERED_THRESHOLD);
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

  test.describe('when there are merged cells', () => {
    test.use({
      adf: tableWithMergedCells,
    });

    test.describe('row handle on hover should display as disabled', () => {
      test('if cells are merged across other rows,', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);

        const cell = await tableModel.cell(8);
        await cell.hover();

        const secondRowControls = await tableModel.rowDragControls(1);
        await secondRowControls.hover();
        await expect(secondRowControls.dragHandleRect).toBeVisible();
        await expect(secondRowControls.dragHandleRect).not.toHaveClass(
          /pm-table-drag-handle-minimised/,
        );
        expect(await secondRowControls.dragButtonClassList()).toContain(
          'pm-table-drag-handle-disabled',
        );
      });
    });

    test.describe('column handle on hover should display as disabled', () => {
      test('if cells are merged across other columns,', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);

        const cell = await tableModel.cell(0);
        await cell.hover();

        const firstColumnControls = await tableModel.columnDragControls(0);
        await firstColumnControls.hover();
        await expect(firstColumnControls.dragHandleRect).toBeVisible();
        await expect(firstColumnControls.dragHandleRect).not.toHaveClass(
          /pm-table-drag-handle-minimised/,
        );
        expect(await firstColumnControls.dragButtonClassList()).toContain(
          'pm-table-drag-handle-disabled',
        );
      });
    });
  });
});
