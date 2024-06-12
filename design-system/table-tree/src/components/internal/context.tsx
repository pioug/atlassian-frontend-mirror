import { createContext } from 'react';

export type ColumnWidth = string | number;

/**
 *
 * Context provider which maintains the column widths and access methods for use in descendent table cells
 * Enables composed table-tree implementations to e.g. set width on header cells only
 */
export const TableTreeContext = createContext<{
	setColumnWidth: (columnIndex: number, width: ColumnWidth) => void;
	getColumnWidth: (columnIndex: number) => ColumnWidth | null;
}>({
	setColumnWidth: () => {},
	getColumnWidth: () => null,
});
