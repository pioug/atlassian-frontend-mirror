import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	tableScrollRegion: {
		id: 'fabric.editor.tableScrollRegion',
		defaultMessage: 'Table scroll region',
		description: 'Label for the scrollable region of a table, used for accessibility purposes.',
	},
	tableOptions: {
		id: 'fabric.editor.tableOptions',
		defaultMessage: 'Table options',
		description: 'Opens a menu with additional table options',
	},
	tableSizeIncreaseScreenReaderInformation: {
		id: 'fabric.editor.tableResizeIncreaseScreenReaderInformation',
		defaultMessage: 'Table width increased to {newWidth, plural, one {# pixel} other {# pixels}}.',
		description:
			'Information for screen reader users about increasing the table size by a certain number of pixels.',
	},
	tableSizeDecreaseScreenReaderInformation: {
		id: 'fabric.editor.tableResizeDecreaseScreenReaderInformation',
		defaultMessage: 'Table width decreased to {newWidth, plural, one {# pixel} other {# pixels}}.',
		description:
			'Information for screen reader users about decreasing the table size by a certain number of pixels.',
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
		description:
			'The text is shown as a menu item in the table options dropdown when the user wants to collapse a table by wrapping it inside an expand element.',
	},
	resizeTable: {
		id: 'fabric.editor.tables.resizeTable',
		defaultMessage: 'Resize table',
		description:
			'Tooltip text shown when hovering over the table width resize handle. Indicates users can drag to adjust the table width.',
	},
	insertColumn: {
		id: 'fabric.editor.insertColumn',
		defaultMessage: 'Insert column right',
		description: 'Inserts a new column to the right of selected column.',
	},
	addColumnLeft: {
		id: 'fabric.editor.addColumnLeft',
		defaultMessage: 'Add column left',
		description: 'Adds a new column to the left of selected column.',
	},
	addColumnRight: {
		id: 'fabric.editor.addColumnRight',
		defaultMessage: 'Add column right',
		description: 'Adds a new column to the right of selected column.',
	},
	insertColumnDrag: {
		id: 'fabric.editor.insertColumnDrag',
		defaultMessage: 'Insert column',
		description: 'Inserts a new column to the right of selected column.',
	},
	removeColumns: {
		id: 'fabric.editor.removeColumns',
		defaultMessage: 'Delete {0, plural, one {column} other {columns}}',
		description:
			'The text is shown as a menu item or button when the user selects one or more table columns to delete them. The message adapts for singular or plural columns.',
	},
	insertRow: {
		id: 'fabric.editor.insertRow',
		defaultMessage: 'Insert row below',
		description: 'Inserts a new row below the selected row.',
	},
	addRowAbove: {
		id: 'fabric.editor.addRowAbove',
		defaultMessage: 'Add row above',
		description: 'Adds a new row above the selected row.',
	},
	addRowBelow: {
		id: 'fabric.editor.addRowBelow',
		defaultMessage: 'Add row below',
		description: 'Adds a new row below the selected row.',
	},
	moveColumnLeft: {
		id: 'fabric.editor.moveColumnLeft',
		defaultMessage: 'Move {0, plural, one {column} other {columns}} left',
		description: 'Moves a column or columns to the left.',
	},
	moveColumnLeftHelpDialogLabel: {
		id: 'fabric.editor.moveColumnLeftHelpDialogLabel',
		defaultMessage: 'Move column left',
		description: 'Description of a keymap that moves one column or multiple columns left, this is in the help dialog and can be simpler than the puralisation version'
	},
	moveColumnRight: {
		id: 'fabric.editor.moveColumnRight',
		defaultMessage: 'Move {0, plural, one {column} other {columns}} right',
		description: 'Moves a column or columns to the right.',
	},
	moveColumnRightHelpDialogLabel: {
		id: 'fabric.editor.moveColumnRightHelpDialogLabel',
		defaultMessage: 'Move column right',
		description: 'Description of a keymap that moves one column or multiple columns right, this is in the help dialog and can be simpler than the puralisation version'
	},
	moveRowUp: {
		id: 'fabric.editor.moveRowUp',
		defaultMessage: 'Move {0, plural, one {row} other {rows}} up',
		description: 'Moves a row or selected rows up.',
	},
	moveRowUpHelpDialogLabel: {
		id: 'fabric.editor.moveRowUpHelpDialogLabel',
		defaultMessage: 'Move row up',
		description: 'Description of a keymap that moves one row or multiple rows up, this is in the help dialog and can be simpler than the puralisation version'
	},
	moveRowDown: {
		id: 'fabric.editor.moveDownDown',
		defaultMessage: 'Move {0, plural, one {row} other {rows}} down',
		description: 'Moves a row or selected rows down.',
	},
	moveRowDownHelpDialogLabel: {
		id: 'fabric.editor.moveRowDownHelpDialogLabel',
		defaultMessage: 'Move row down',
		description: 'Description of a keymap that moves one row or multiple rows down, this is in the help dialog and can be simpler than the puralisation version'
	},
	insertRowDrag: {
		id: 'fabric.editor.insertRowDrag',
		defaultMessage: 'Insert row',
		description: 'Inserts a new row below the selected row.',
	},
	removeRows: {
		id: 'fabric.editor.removeRows',
		defaultMessage: 'Delete {0, plural, one {row} other {rows}}',
		description:
			'The text is shown as a menu item or button when the user selects one or more table rows to delete them. The message adapts for singular or plural rows.',
	},
	rowNumbers: {
		id: 'fabrid.editor.rowNumbers',
		defaultMessage: 'Row numbers',
		description:
			'The text is shown as a label for a toggle option in the table options menu that adds a number to each row except the header row.',
	},
	numberedRows: {
		id: 'fabrid.editor.numberedRows',
		defaultMessage: 'Numbered rows',
		description:
			'The text is shown as a label for a toggle option in the table options menu that adds a number to each row except the header row.',
	},
	rowsAreInserted: {
		id: 'fabric.editor.rowsAreInserted',
		defaultMessage: '{count, plural, one {A row has been} other {{count} rows have been}} inserted',
		description: 'Assistive message following the insertion of row(s)',
	},
	rowsAreRemoved: {
		id: 'fabric.editor.rowsAreRemoved',
		defaultMessage:
			'{count, plural, one {The row has been} other {{count} rows have been}} removed',
		description: 'Assistive message following the removal of row(s)',
	},
	rowSelected: {
		id: 'fabric.editor.rowSelected',
		defaultMessage: 'Row {index} of {total} selected',
		description: 'Assistive message following the selection of a row',
	},
	rowMovedUp: {
		id: 'fabric.editor.rowMovedUp',
		defaultMessage: 'Row moved up to {index} of {total}',
		description: 'Assistive message following the upward movement of a row',
	},
	rowMovedDown: {
		id: 'fabric.editor.rowMovedDown',
		defaultMessage: 'Row moved down to {index} of {total}',
		description: 'Assistive message following the downward movement of a row',
	},
	columnsAreInserted: {
		id: 'fabric.editor.columnsAreInserted',
		defaultMessage:
			'{count, plural, one {A column has been} other {{count} columns have been}} inserted',
		description: 'Assistive message following the insertion of column(s)',
	},
	columnsAreRemoved: {
		id: 'fabric.editor.columnsAreRemoved',
		defaultMessage:
			'{count, plural, one {The column has been} other {{count} columns have been}} removed',
		description: 'Assistive message following the removal of column(s)',
	},
	columnSelected: {
		id: 'fabric.editor.columnSelected',
		defaultMessage: 'Column {index} of {total} selected',
		description: 'Assistive message following the selection of a column',
	},
	columnMovedLeft: {
		id: 'fabric.editor.columnMovedLeft',
		defaultMessage: 'Column moved left to {index} of {total}',
		description: 'Assistive message following the left movement of a column',
	},
	columnMovedRight: {
		id: 'fabric.editor.columnMovedRight',
		defaultMessage: 'Column moved right to {index} of {total}',
		description: 'Assistive message following the right movement of a column',
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
		description: 'Message for confirm modal when deleting a table linked to an extension.',
	},
	confirmDeleteLinkedModalMessagePrefix: {
		id: 'fabric.editor.extension.confirmDeleteLinkedModalMessagePrefix',
		defaultMessage: 'Deleting',
		description: 'prefix for confirmation dialog text',
	},
	confirmModalCheckboxLabel: {
		id: 'fabric.editor.floatingToolbar.confirmModalCheckboxLabel',
		defaultMessage: 'Also delete connected elements',
		description:
			'The text is shown as a checkbox label in a confirmation dialog when the user is about to delete an element that has connected extensions.',
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
	backgroundColor: {
		id: 'fabric.editor.backgroundColor',
		defaultMessage: 'Background color',
		description: 'Change the background color of a table cell.',
	},
	mergeCells: {
		id: 'fabric.editor.mergeCells',
		defaultMessage: 'Merge cells',
		description:
			'The text is shown as a menu item in the cell options menu when the user selects multiple table cells to merge them into a single cell.',
	},
	splitCell: {
		id: 'fabric.editor.splitCell',
		defaultMessage: 'Split cell',
		description:
			'The text is shown as a menu item in the cell options menu when the user wants to split a previously merged table cell back into individual cells.',
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
	sortColumnIncreasing: {
		id: 'fabric.editor.sortColumnIncreasing',
		defaultMessage: 'Sort increasing',
		description: 'Sort column in ascending order',
	},
	sortColumnDecreasing: {
		id: 'fabric.editor.sortColumnDecreasing',
		defaultMessage: 'Sort decreasing',
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
	lockColumnWidths: {
		id: 'fabric.editor.lockColumns',
		defaultMessage: 'Fixed column widths',
		description: 'Toggle button to enable fixed column widths',
	},
	rowControl: {
		id: 'fabric.editor.rowControl',
		defaultMessage: 'Highlight row',
		description:
			'A button on the left of each row that shows up when the table is in focus. Clicking on it will select the entire row.',
	},
	rowDragHandle: {
		id: 'fabric.editor.rowDragHandle',
		defaultMessage: 'Row options',
		description:
			'The row drag handle to move the row within the table. Click to open a menu for more row options.',
	},
	dragHandleZone: {
		id: 'fabric.editor.dragHandleZone',
		defaultMessage: 'Activate drag handle zone',
		description:
			'The drag handle zone to trigger the drag handle to move the row/column within the table.',
	},
	columnDragHandle: {
		id: 'fabric.editor.columnDragHandle',
		defaultMessage: 'Column options',
		description:
			'The column drag handle to move the column within the table. Click to open a menu for more column options.',
	},
	fullWidthLabel: {
		id: 'fabric.editor.tableFullWidthLabel',
		defaultMessage: 'Full-width',
		description: 'Trigger table width to full-width mode',
	},
	startedColumnResize: {
		id: 'fabric.editor.tables.startedColumnResize',
		defaultMessage: 'Started column resize',
		description: 'Screen Reader announces when the user engages the column resizer',
	},
	focusedOtherResize: {
		id: 'fabric.editor.tables.otherResize',
		defaultMessage:
			'{direction, select, left {Switched to the left column resize} right {Switched to the right column resize} other {}}',
		description:
			'Screen Reader announces when the user switches to the left or right column resizer',
	},
	changedColumnWidth: {
		id: 'fabric.editor.tables.columnWidth',
		defaultMessage:
			'{width, plural, one {Column width was changed to {width} pixel} other {Column width was changed to {width} pixels}}',
		description: 'Screen Reader announces when the user modifies the column width',
	},
	columnResizeStop: {
		id: 'fabric.editor.tables.resizeStop',
		defaultMessage: 'Stopped resize',
		description: 'Screen Reader announces when the user discontinues the resizing operation',
	},
	columnResizeOverflow: {
		id: 'fabric.editor.tables.columnResizeOverflow',
		defaultMessage: 'You can only resize this column while the table has a scroll bar.',
		description:
			'Screen Reader announces when the user attempts to resize the last column without the table being in overflow state',
	},
	columnResizeLast: {
		id: 'fabric.editor.tables.columnResizeLast',
		defaultMessage: 'You can only resize this column to the left.',
		description:
			'Screen Reader announces when the user attempts to resize the last column when only the previous one is available for resizing',
	},
	tableAlignmentOptions: {
		id: 'fabric.editor.tableAlignmentOptions',
		defaultMessage: 'Alignment options',
		description: 'Opens a menu with additional table alignment options',
	},
	alignTableCenter: {
		id: 'fabric.editor.alignTableCenter',
		defaultMessage: 'Align center',
		description:
			'The text is shown as a menu item in the table alignment options menu when the user wants to align the table to the center of the page.',
	},
	alignTableLeft: {
		id: 'fabric.editor.alignTableLeft',
		defaultMessage: 'Align left',
		description:
			'The text is shown as a menu item in the table alignment options menu when the user wants to align the table to the left side of the page.',
	},
});
