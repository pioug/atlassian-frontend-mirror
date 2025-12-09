import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TablePlugin } from '../../tablePluginType';

import { CornerControls } from './CornerControls/ClassicCornerControls';
import { RowControls } from './RowControls/ClassicControls';

type FloatingControlsWithSelectionProps = {
	api?: ExtractInjectionAPI<TablePlugin>;
	editorView: EditorView;
	hoveredRows?: number[];
	hoverRows: (rows: number[]) => void;
	isHeaderColumnEnabled?: boolean;
	isHeaderRowEnabled?: boolean;
	isInDanger?: boolean;
	isResizing?: boolean;
	selectRow: (row: number, expand: boolean) => void;
	stickyTop?: number;
	tableActive: boolean;
	tableRef: HTMLTableElement;
};

export const FloatingControlsWithSelection = ({
	editorView,
	tableRef,
	isInDanger,
	isResizing,
	isHeaderRowEnabled,
	isHeaderColumnEnabled,
	hoveredRows,
	stickyTop,
	hoverRows,
	selectRow,
	tableActive,
	api,
}: FloatingControlsWithSelectionProps): React.JSX.Element => {
	const { selection } = useSharedPluginStateWithSelector(api, ['selection'], (states) => ({
		selection: states.selectionState?.selection,
	}));
	return (
		<>
			<CornerControls
				editorView={editorView}
				tableRef={tableRef}
				isInDanger={isInDanger}
				isResizing={isResizing}
				isHeaderRowEnabled={isHeaderRowEnabled}
				isHeaderColumnEnabled={isHeaderColumnEnabled}
				hoveredRows={hoveredRows}
				stickyTop={tableActive ? stickyTop : undefined}
			/>
			<RowControls
				selection={selection}
				editorView={editorView}
				tableRef={tableRef}
				hoverRows={hoverRows}
				hoveredRows={hoveredRows}
				isInDanger={isInDanger}
				isResizing={isResizing}
				selectRow={selectRow}
				stickyTop={tableActive ? stickyTop : undefined}
			/>
		</>
	);
};
