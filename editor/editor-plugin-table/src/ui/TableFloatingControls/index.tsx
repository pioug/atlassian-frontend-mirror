import React, { useCallback } from 'react';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import { browser } from '@atlaskit/editor-common/browser';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { hoverCell, hoverRows, selectRow, selectRows } from '../../commands';
import type { TablePlugin } from '../../plugin';
import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import { TableCssClassName as ClassName } from '../../types';
import type { CellHoverMeta } from '../../types';
import { isTableNested } from '../../utils/nodes';

import {
	CornerControls,
	DragCornerControls,
	DragCornerControlsWithSelection,
} from './CornerControls';
import { FloatingControlsWithSelection } from './FloatingControlsWithSelection';
import NumberColumn from './NumberColumn';
import { DragControls, RowControls } from './RowControls';

interface TableFloatingControlsProps {
	editorView: EditorView;
	selection?: Selection;
	tableRef?: HTMLTableElement;
	tableNode?: PmNode;
	tableActive?: boolean;
	isInDanger?: boolean;
	isTableHovered?: boolean;
	isResizing?: boolean;
	isHeaderRowEnabled?: boolean;
	isHeaderColumnEnabled?: boolean;
	isNumberColumnEnabled?: boolean;
	isDragAndDropEnabled?: boolean;
	hasHeaderRow?: boolean;
	headerRowHeight?: number;
	hoveredRows?: number[];
	hoveredCell?: CellHoverMeta;
	ordering?: TableColumnOrdering;
	stickyHeader?: RowStickyState;
	insertRowButtonIndex?: number;
	tableWrapperWidth?: number;
	isChromelessEditor?: boolean;
}

export const TableFloatingControls = ({
	editorView,
	tableRef,
	tableNode,
	isInDanger,
	isResizing,
	isNumberColumnEnabled,
	isHeaderRowEnabled,
	isHeaderColumnEnabled,
	tableActive,
	hasHeaderRow,
	hoveredRows,
	stickyHeader,
	isDragAndDropEnabled,
	hoveredCell,
	isTableHovered,
	tableWrapperWidth,
	api,
	isChromelessEditor,
}: TableFloatingControlsProps & { api?: ExtractInjectionAPI<TablePlugin> }) => {
	const _selectRow = useCallback(
		(row: number, expand: boolean) => {
			const { state, dispatch } = editorView;
			// fix for issue ED-4665
			if (browser.ie_version === 11) {
				(editorView.dom as HTMLElement).blur();
			}
			selectRow(row, expand)(state, dispatch);
		},
		[editorView],
	);

	const _selectRows = useCallback(
		(rowIndexes: number[]) => {
			const { state, dispatch } = editorView;
			// fix for issue ED-4665
			if (browser.ie_version === 11) {
				(editorView.dom as HTMLElement).blur();
			}
			selectRows(rowIndexes)(state, dispatch);
		},
		[editorView],
	);

	const _hoverRows = useCallback(
		(rows: Array<number>, danger?: boolean) => {
			const { state, dispatch } = editorView;
			hoverRows(rows, danger)(state, dispatch);
		},
		[editorView],
	);

	// re-use across numbered columns and row controls
	const updateCellHoverLocation = useCallback(
		(rowIndex: number) => {
			const { state, dispatch } = editorView;

			if (tableActive) {
				// For context:  Whenever we mouse over a column or row drag handle, we will ALWAYS be hovering over the 0 index
				// of the opposite dimension. For example; here when we mouse over the row drag handle then we're technically
				// also hovering over column 0 index. And vice-versa with columns. This means we don't need to worry about knowing the
				// current column index. We can just force it to 0.
				hoverCell(rowIndex, 0)(state, dispatch);
			}
		},
		[editorView, tableActive],
	);

	const { featureFlagsState } = useSharedPluginState(api, ['featureFlags']);

	if (!tableRef) {
		return null;
	}

	const stickyTop =
		stickyHeader && stickyHeader.sticky && hasHeaderRow ? stickyHeader.top : undefined;

	const wrapperClassName = isDragAndDropEnabled
		? isChromelessEditor
			? ClassName.DRAG_ROW_CONTROLS_WRAPPER + ' ' + ClassName.TABLE_CHROMELESS
			: ClassName.DRAG_ROW_CONTROLS_WRAPPER
		: ClassName.ROW_CONTROLS_WRAPPER;

	const tablePos = findTable(editorView.state.selection)?.pos;
	const isNested = tablePos !== undefined && isTableNested(editorView.state, tablePos!);
	const shouldShowCornerControls = !featureFlagsState?.elementDragAndDrop || isNested;

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div className={wrapperClassName}>
			<div onMouseDown={(e) => !isDragAndDropEnabled && e.preventDefault()}>
				{isNumberColumnEnabled ? (
					<NumberColumn
						editorView={editorView}
						hoverRows={_hoverRows}
						tableRef={tableRef}
						tableActive={tableActive}
						hoveredRows={hoveredRows}
						hasHeaderRow={hasHeaderRow}
						isInDanger={isInDanger}
						isResizing={isResizing}
						selectRow={_selectRow}
						updateCellHoverLocation={updateCellHoverLocation}
						stickyTop={stickyTop}
						isDragAndDropEnabled={isDragAndDropEnabled}
					/>
				) : null}

				{tableActive && (
					<>
						{isDragAndDropEnabled ? (
							<>
								{shouldShowCornerControls &&
									(editorExperiment('platform_editor_table_use_shared_state_hook', true) ? (
										<DragCornerControlsWithSelection
											editorView={editorView}
											tableRef={tableRef}
											isInDanger={isInDanger}
											isResizing={isResizing}
											api={api}
										/>
									) : (
										<DragCornerControls
											editorView={editorView}
											tableRef={tableRef}
											isInDanger={isInDanger}
											isResizing={isResizing}
										/>
									))}
								<DragControls
									tableRef={tableRef}
									tableNode={tableNode}
									hoveredCell={hoveredCell}
									isTableHovered={isTableHovered}
									editorView={editorView}
									tableActive={tableActive}
									isInDanger={isInDanger}
									isResizing={isResizing}
									tableWidth={tableWrapperWidth!}
									hoverRows={_hoverRows}
									selectRow={_selectRow}
									selectRows={_selectRows}
									updateCellHoverLocation={updateCellHoverLocation}
								/>
							</>
						) : editorExperiment('platform_editor_table_use_shared_state_hook', true) ? (
							<FloatingControlsWithSelection
								editorView={editorView}
								tableRef={tableRef}
								isInDanger={isInDanger}
								isResizing={isResizing}
								isHeaderRowEnabled={isHeaderRowEnabled}
								isHeaderColumnEnabled={isHeaderColumnEnabled}
								hoveredRows={hoveredRows}
								stickyTop={tableActive ? stickyTop : undefined}
								tableActive={tableActive}
								hoverRows={_hoverRows}
								selectRow={_selectRow}
								api={api}
							/>
						) : (
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
									editorView={editorView}
									tableRef={tableRef}
									hoverRows={_hoverRows}
									hoveredRows={hoveredRows}
									isInDanger={isInDanger}
									isResizing={isResizing}
									selectRow={_selectRow}
									stickyTop={tableActive ? stickyTop : undefined}
								/>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default TableFloatingControls;
