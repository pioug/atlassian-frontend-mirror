import React from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MenuType } from '@atlaskit/editor-ui-control-model';

export type TableMenuContextValue = {
	canMergeCells?: boolean;
	canMoveColumnLeft?: boolean;
	canMoveColumnRight?: boolean;
	canMoveRowDown?: boolean;
	canMoveRowUp?: boolean;
	canSplitCell?: boolean;
	editorView?: EditorView;
	hasMergedCellsInTable?: boolean;
	isFirstColumn?: boolean;
	isFirstRow?: boolean;
	isLastColumn?: boolean;
	isLastRow?: boolean;
	selectedColumnCount?: number;
	selectedRowCount?: number;
	surface: MenuType;
};

const TableMenuContext = React.createContext<TableMenuContextValue | undefined>(undefined);

export const TableMenuProvider: React.Provider<TableMenuContextValue | undefined> =
	TableMenuContext.Provider;

export const useTableMenuContext = (): TableMenuContextValue | undefined =>
	React.useContext(TableMenuContext);
