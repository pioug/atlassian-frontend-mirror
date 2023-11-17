import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  tableOptions: {
    id: 'fabric.editor.tableOptions',
    defaultMessage: 'Table options',
    description: 'Opens a menu with additional table options',
  },
  headerRow: {
    id: 'fabric.editor.headerRow',
    defaultMessage: 'Header row',
    description: 'Marks the first table row as a header row',
  },
  headerColumn: {
    id: 'fabric.editor.headerColumn',
    defaultMessage: 'Header column',
    description: 'Marks the first table column as a header row',
  },
  numberedColumn: {
    id: 'fabric.editor.numberedColumn',
    defaultMessage: 'Numbered column',
    description: 'Adds an auto-numbering column to your table',
  },
  collapseTable: {
    id: 'fabric.editor.collapseTable',
    defaultMessage: 'Collapse table',
    description: 'Wraps table in an expand',
  },
  resizeTable: {
    id: 'fabric.editor.tables.resizeTable',
    defaultMessage: 'Resize table',
    description: 'Tooltip displayed on custom table width resize hande',
  },
  insertColumn: {
    id: 'fabric.editor.insertColumn',
    defaultMessage: 'Insert column right',
    description: 'Inserts a new column to the right of selected column.',
  },
  insertColumnDrag: {
    id: 'fabric.editor.insertColumnDrag',
    defaultMessage: 'Insert column',
    description: 'Inserts a new column to the right of selected column.',
  },
  removeColumns: {
    id: 'fabric.editor.removeColumns',
    defaultMessage: 'Delete {0, plural, one {column} other {columns}}',
    description: 'Deletes a table column.',
  },
  insertRow: {
    id: 'fabric.editor.insertRow',
    defaultMessage: 'Insert row below',
    description: 'Inserts a new row below the selected row.',
  },
  insertRowDrag: {
    id: 'fabric.editor.insertRowDrag',
    defaultMessage: 'Insert row',
    description: 'Inserts a new row below the selected row.',
  },
  removeRows: {
    id: 'fabric.editor.removeRows',
    defaultMessage: 'Delete {0, plural, one {row} other {rows}}',
    description: 'Deletes a table row.',
  },
  cellOptions: {
    id: 'fabric.editor.cellOptions',
    defaultMessage: 'Cell options',
    description: 'Opens a menu with options for the current table cell.',
  },
  confirmDeleteLinkedModalOKButton: {
    id: 'fabric.editor.tables.confirmDeleteLinkedModalOKButton',
    defaultMessage: 'Delete',
    description:
      'Action button label for confirm modal when deleting a table linked to an extension.',
  },
  confirmDeleteLinkedModalMessage: {
    id: 'fabric.editor.tables.confirmDeleteLinkedModalMessage',
    defaultMessage: 'Deleting {nodeName} will break anything connected to it.',
    description:
      'Message for confirm modal when deleting a table linked to an extension.',
  },
  confirmDeleteLinkedModalMessagePrefix: {
    id: 'fabric.editor.extension.confirmDeleteLinkedModalMessagePrefix',
    defaultMessage: 'Deleting',
    description: 'prefix for confirmation dialog text',
  },
  confirmModalCheckboxLabel: {
    id: 'fabric.editor.floatingToolbar.confirmModalCheckboxLabel',
    defaultMessage: 'Also delete connected elements',
    description: 'checkbox label text',
  },
  deleteElementTitle: {
    id: 'fabric.editor.extension.deleteElementTitle',
    defaultMessage: 'Delete element',
    description:
      'Title text for confirm modal when deleting an extension linked to a data consumer.',
  },
  unnamedSource: {
    id: 'fabric.editor.extension.sourceNoTitledName',
    defaultMessage: 'this element',
    description: 'The current element without preset name been selected',
  },
  adjustColumns: {
    id: 'fabric.editor.tables.adjustColumn',
    defaultMessage: 'Adjust column',
    description: 'Tooltip displayed on table column resize handle',
  },
  cornerControl: {
    id: 'fabric.editor.cornerControl',
    defaultMessage: 'Highlight table',
    description:
      'A button on the upper left corner of the table that shows up when the table is in focus. Clicking on it will select the entire table.',
  },
  cellBackground: {
    id: 'fabric.editor.cellBackground',
    defaultMessage: 'Cell background',
    description: 'Change the background color of a table cell.',
  },
  mergeCells: {
    id: 'fabric.editor.mergeCells',
    defaultMessage: 'Merge cells',
    description: 'Merge tables cells together.',
  },
  splitCell: {
    id: 'fabric.editor.splitCell',
    defaultMessage: 'Split cell',
    description: 'Split a merged table cell.',
  },
  clearCells: {
    id: 'fabric.editor.clearCells',
    defaultMessage: 'Clear {0, plural, one {cell} other {cells}}',
    description:
      'Clears the contents of the selected cells (this does not delete the cells themselves).',
  },
  sortColumnASC: {
    id: 'fabric.editor.sortColumnASC',
    defaultMessage: 'Sort column A → Z',
    description: 'Sort column in ascending order',
  },
  sortColumnDESC: {
    id: 'fabric.editor.sortColumnDESC',
    defaultMessage: 'Sort column Z → A',
    description: 'Sort column in descending order',
  },
  canNotSortTable: {
    id: 'fabric.editor.canNotSortTable',
    defaultMessage: `⚠️ You can't sort a table with merged cells`,
    description: `Split your cells to enable this feature`,
  },
  distributeColumns: {
    id: 'fabric.editor.distributeColumns',
    defaultMessage: `Distribute columns`,
    description: `Distribute widths between selected columns`,
  },
  rowControl: {
    id: 'fabric.editor.rowControl',
    defaultMessage: 'Highlight row',
    description:
      'A button on the left of each row that shows up when the table is in focus. Clicking on it will select the entire row.',
  },
});
