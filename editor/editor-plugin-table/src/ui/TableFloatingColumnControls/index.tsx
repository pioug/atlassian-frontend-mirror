import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import type { CellHoverMeta, DraggableSourceData, PluginInjectionAPI } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import { containsHeaderColumn, getColumnsWidths, getRowHeights } from '../../utils';

import { ColumnControls } from './ColumnControls';
import { ColumnDropTargets } from './ColumnDropTargets';

export interface Props {
	editorView: EditorView;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	selection?: Selection;
	tableRef?: HTMLTableElement;
	getNode: () => PmNode;
	tableActive?: boolean;
	isInDanger?: boolean;
	hasHeaderRow?: boolean;
	headerRowHeight?: number;
	hoveredRows?: number[];
	hoveredCell?: CellHoverMeta;
	isResizing?: boolean;
	ordering?: TableColumnOrdering;
	stickyHeader?: RowStickyState;
	isTableHovered?: boolean;
	tableContainerWidth?: number;
	isNumberColumnEnabled?: boolean;
	getScrollOffset?: () => number;
	tableWrapperHeight?: number;
	api?: PluginInjectionAPI;
}

export const TableFloatingColumnControls = ({
	editorView,
	tableRef,
	getNode,
	tableActive,
	hasHeaderRow,
	hoveredCell,
	isResizing,
	stickyHeader,
	selection,
	isInDanger,
	isTableHovered,
	tableContainerWidth,
	isNumberColumnEnabled,
	getScrollOffset,
	tableWrapperHeight,
	api,
}: Props) => {
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const node = getNode();
	const currentNodeLocalId = node?.attrs.localId;
	const hasHeaderColumn = containsHeaderColumn(node);
	const stickyTop =
		stickyHeader && stickyHeader.sticky && hasHeaderRow ? stickyHeader.top : undefined;

	useEffect(() => {
		return monitorForElements({
			canMonitor({ source }) {
				const { type, localId, indexes } = source.data as Partial<DraggableSourceData>;
				return type === 'table-column' && !!indexes?.length && localId === currentNodeLocalId;
			},
			onDragStart() {
				setIsDragging(true);
			},
			onDrop() {
				setIsDragging(false);
			},
		});
	}, [editorView, currentNodeLocalId]);

	const rowHeights = useMemo(() => {
		// NOTE: we don't care so much as to what tableHeight is, we only care that it changed and is a sane value.
		if (tableRef && !!tableWrapperHeight) {
			return getRowHeights(tableRef);
		}
		return [0];
	}, [tableRef, tableWrapperHeight]);

	if (!tableRef || !tableActive || isResizing) {
		return null;
	}

	const colWidths = getColumnsWidths(editorView);

	if (stickyTop) {
		const headerRowHeight = hasHeaderRow && stickyTop !== undefined ? rowHeights?.[0] ?? 0 : 0;
		containerRef?.current?.style.setProperty(
			'top',
			`${stickyTop! - headerRowHeight + 33}px`, // 33px is padding and margin applied on tr.sticky
		);
	} else {
		containerRef?.current?.style.removeProperty('top');
	}

	return (
		<div
			ref={containerRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={ClassName.DRAG_COLUMN_CONTROLS_WRAPPER}
			data-testid="table-floating-column-controls-wrapper"
		>
			<ColumnControls
				editorView={editorView}
				hoveredCell={hoveredCell}
				tableRef={tableRef}
				tableActive={tableActive}
				isTableHovered={isTableHovered}
				stickyTop={tableActive ? stickyTop : undefined}
				localId={currentNodeLocalId}
				isInDanger={isInDanger}
				rowHeights={rowHeights}
				colWidths={colWidths}
				hasHeaderColumn={hasHeaderColumn}
				tableContainerWidth={tableContainerWidth}
				isNumberColumnEnabled={isNumberColumnEnabled}
				isDragging={isDragging}
				getScrollOffset={getScrollOffset}
				api={getBooleanFF('platform.editor.table.use-shared-state-hook') ? api : undefined}
			/>
			{isDragging && (
				<ColumnDropTargets
					tableRef={tableRef}
					isHeaderSticky={stickyHeader?.sticky && hasHeaderRow}
					tableHeight={tableWrapperHeight}
					localId={currentNodeLocalId}
					colWidths={colWidths}
					getScrollOffset={getScrollOffset}
				/>
			)}
		</div>
	);
};

export default TableFloatingColumnControls;
