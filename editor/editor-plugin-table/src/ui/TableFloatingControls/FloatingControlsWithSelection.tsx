import React from 'react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TablePlugin } from '../../tablePluginType';

import { CornerControls } from './CornerControls/ClassicCornerControls';
import { RowControls } from './RowControls/ClassicControls';

type FloatingControlsWithSelectionProps = {
	editorView: EditorView;
	tableRef: HTMLTableElement;
	isInDanger?: boolean;
	isResizing?: boolean;
	isHeaderRowEnabled?: boolean;
	isHeaderColumnEnabled?: boolean;
	hoveredRows?: number[];
	stickyTop?: number;
	hoverRows: (rows: number[]) => void;
	selectRow: (row: number, expand: boolean) => void;
	tableActive: boolean;
	api?: ExtractInjectionAPI<TablePlugin>;
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TablePlugin> | undefined) => {
		const selectionsSelector = useSharedPluginStateSelector(api, 'selection.selection');
		return {
			selection: selectionsSelector,
		};
	},
	(api: ExtractInjectionAPI<TablePlugin> | undefined) => {
		const { selectionState } = useSharedPluginState(api, ['selection']);
		return {
			selection: selectionState?.selection,
		};
	},
);

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
}: FloatingControlsWithSelectionProps) => {
	const { selection } = useSharedState(api);
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
