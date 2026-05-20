import React from 'react';

export type TableMenuContextValue = {
	canMergeCells?: boolean;
	canSplitCell?: boolean;
	hasMergedCellsInTable?: boolean;
	isFirstColumn?: boolean;
	isFirstRow?: boolean;
	isLastColumn?: boolean;
	isLastRow?: boolean;
	selectedColumnCount?: number;
	selectedRowCount?: number;
};

const TableMenuContext = React.createContext<TableMenuContextValue | undefined>(undefined);

export const TableMenuProvider: React.Provider<TableMenuContextValue | undefined> =
	TableMenuContext.Provider;

export const useTableMenuContext = (): TableMenuContextValue | undefined =>
	React.useContext(TableMenuContext);
