import {
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import {
  tableWithCellsMergedAcrossColumns,
  tableWithCellsMergedAcrossRows,
} from './drag-menu.spec.ts-fixtures';

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
  adf: tableWithCellsMergedAcrossColumns,
  platformFeatureFlags: {
    'platform.editor.custom-table-width': true,
  },
});

test.describe('drag and drop menu', () => {
  test.describe('move options when cells merged across columns', () => {
    /*
      tableWithCellsMergedAcrossColumns:
         --- --- --- --- --- --- --- --- ---
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
         --- --- --- --- --- --- --- --- ---
        | A |   |   |   |   |   |   |   |   |
         --- --- --- --- --- --- --- --- ---
        | B |   |       |   |       |   |   |
         --- --- ------- --- --- --- --- ---
        | C |   |   |   |   |   |   |   |   |
         --- --- --- --- --- --- --- --- ---
        |   |   |   |   |   |   |   |   |   |
         --- --- --- --- --- --- --- --- ---
    */
    // Row special cases
    test.describe('move row', () => {
      test('in case A when row below has merged cells only across columns', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const secondRow = await tableModel.rowDragControls(1);
        const cell = await tableModel.cell(9);
        await cell.hover();

        const dragMenu = await secondRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be enabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeEnabled();
        });
        await test.step('down should be enabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeEnabled();
        });
      });

      test('in case B when souce has merged cells across columns within itself', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const thirdRow = await tableModel.rowDragControls(2);
        const cell = await tableModel.cell(18);
        await cell.hover();

        const dragMenu = await thirdRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be disabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeDisabled();
        });
        await test.step('down should be disabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeDisabled();
        });
      });

      test('in case C when row above has merged cells across columns', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const fourthRow = await tableModel.rowDragControls(3);
        const cell = await tableModel.cell(25);
        await cell.hover();

        const dragMenu = await fourthRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be disabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeEnabled();
        });
        await test.step('down should be enabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeEnabled();
        });
      });
    });

    test.describe('move column', () => {
      test('in case 0 when souce is the first column', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstColumn = await tableModel.columnDragControls(0);

        const cell = await tableModel.cell(0);
        await cell.hover();

        const dragMenu = await firstColumn.menu(EditorPopupModel.from(editor));

        await test.step('left should be disabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeDisabled();
        });
        await test.step('right should be enabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeEnabled();
        });
      });

      test('in case 8 when souce is the last column', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const lastColumn = await tableModel.columnDragControls(8);

        const cell = await tableModel.cell(8);
        await cell.hover();

        const dragMenu = await lastColumn.menu(EditorPopupModel.from(editor));
        await test.step('right should be disabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeDisabled();
        });
        await test.step('left should be enabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeEnabled();
        });
      });

      test('in case 1 when column on the right has merged cells across columns', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const secondColumn = await tableModel.columnDragControls(1);

        const cell = await tableModel.cell(1);
        await cell.hover();

        const dragMenu = await secondColumn.menu(EditorPopupModel.from(editor));
        await test.step('left should be enabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeEnabled();
        });
        await test.step('right should be disabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeDisabled();
        });
      });

      test('in case 2 when source has merged cells with another column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const thirdColumn = await tableModel.columnDragControls(2);

        const cell = await tableModel.cell(2);
        await cell.hover();

        const dragMenu = await thirdColumn.menu(EditorPopupModel.from(editor));
        await test.step('left should be disabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeDisabled();
        });
        await test.step('right should be disabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeDisabled();
        });
      });

      test('in case 4 when source is between columns with merged cells across other columns', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const fifthColumn = await tableModel.columnDragControls(4);

        const cell = await tableModel.cell(4);
        await cell.hover();

        const dragMenu = await fifthColumn.menu(EditorPopupModel.from(editor));
        await test.step('left should be disabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeDisabled();
        });
        await test.step('right should be disabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeDisabled();
        });
      });

      test('in case 7 when column on the right has merged cells with another column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const eigthColumn = await tableModel.columnDragControls(7);

        const cell = await tableModel.cell(7);
        await cell.hover();

        const dragMenu = await eigthColumn.menu(EditorPopupModel.from(editor));
        await test.step('left should be disabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeDisabled();
        });
        await test.step('right should be enabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeEnabled();
        });
      });
    });
  });

  test.describe('move options when cells merged across rows', () => {
    test.use({
      adf: tableWithCellsMergedAcrossRows,
    });
    /*
      tableWithCellsMergedAcrossRows:
         --- --- --- --- ---
        | 0 | A | B | C |   |
         --- --- --- --- ---
        | 1 |   |   |   |   |
         --- --- --- --- ---
        | 2 |   |   |   |   |
         --- ---     --- ---
        | 3 |   |   |   |   |
         --- --- --- --- ---
        | 4 |   |   |   |   |
         --- --- --- --- ---
        | 5 |   |   |   |   |
         --- ---     --- ---
        | 6 |   |   |   |   |
         --- --- --- --- ---
        | 7 |   |   |   |   |
         --- --- --- --- ---
        | 8 |   |   |   |   |
         --- --- --- --- ---
    */
    test.describe('move row', () => {
      test('in case 0 when source is the first row', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstRow = await tableModel.rowDragControls(0);
        const cell = await tableModel.cell(0);
        await cell.hover();

        const dragMenu = await firstRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be disabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeDisabled();
        });
        await test.step('down should be enabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeEnabled();
        });
      });

      test('in case 8 when source is the last row', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const lastRow = await tableModel.rowDragControls(8);
        const cell = await tableModel.cell(38);
        await cell.hover();

        const dragMenu = await lastRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be enabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeEnabled();
        });
        await test.step('down should be disabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeDisabled();
        });
      });

      test('in case 1 when row below has merged cells with another row', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const secondRow = await tableModel.rowDragControls(1);
        const cell = await tableModel.cell(5);
        await cell.hover();

        const dragMenu = await secondRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be enabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeEnabled();
        });
        await test.step('down should be disabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeDisabled();
        });
      });

      test('in case 2 when source has merged cells with another row', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const thirdRow = await tableModel.rowDragControls(2);
        const cell = await tableModel.cell(10);
        await cell.hover();

        const dragMenu = await thirdRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be disabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeDisabled();
        });
        await test.step('down should be disabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeDisabled();
        });
      });

      test('in case 4 when source is between rows that have merged cells with other rows', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const fifthRow = await tableModel.rowDragControls(4);
        const cell = await tableModel.cell(19);
        await cell.hover();

        const dragMenu = await fifthRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be disabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeDisabled();
        });
        await test.step('down should be disabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeDisabled();
        });
      });

      test('in case 7 when row above has merged cells with another row', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const eighthRow = await tableModel.rowDragControls(7);
        const cell = await tableModel.cell(33);
        await cell.hover();

        const dragMenu = await eighthRow.menu(EditorPopupModel.from(editor));
        await test.step('up should be disabled', async () => {
          await expect(dragMenu.moveRowUpMenuItem).toBeDisabled();
        });
        await test.step('down should be enabled', async () => {
          await expect(dragMenu.moveRowDownMenuItem).toBeEnabled();
        });
      });
    });

    // Column special cases
    test.describe('move column options when cells merged across rows', () => {
      test('in case A when column on the left has merged cells only across rows', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const secondColumn = await tableModel.columnDragControls(1);

        const cell = await tableModel.cell(1);
        await cell.hover();

        const dragMenu = await secondColumn.menu(EditorPopupModel.from(editor));

        await test.step('left should be enabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeEnabled();
        });
        await test.step('right should be enabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeEnabled();
        });
      });

      test('in case B when souce has merged cells', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const thirdColumn = await tableModel.columnDragControls(2);

        const cell = await tableModel.cell(2);
        await cell.hover();

        const dragMenu = await thirdColumn.menu(EditorPopupModel.from(editor));
        await test.step('right should be disabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeDisabled();
        });
        await test.step('left should be disabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeDisabled();
        });
      });

      test('in case C when column on the left has merged cells only across rows', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const fourthColumn = await tableModel.columnDragControls(3);

        const cell = await tableModel.cell(3);
        await cell.hover();

        const dragMenu = await fourthColumn.menu(EditorPopupModel.from(editor));
        await test.step('left should be enabled', async () => {
          await expect(dragMenu.moveColumnLeftMenuItem).toBeEnabled();
        });
        await test.step('right should be enabled', async () => {
          await expect(dragMenu.moveColumnRightMenuItem).toBeEnabled();
        });
      });
    });
  });
});
