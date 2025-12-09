import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { RowStickyState } from '../../pm-plugins/sticky-headers/types';
import { isAnchorSupported } from '../../pm-plugins/utils/anchor';
import { getColumnsWidths } from '../../pm-plugins/utils/column-controls';
import { containsHeaderColumn } from '../../pm-plugins/utils/nodes';
import { getRowHeights } from '../../pm-plugins/utils/row-controls';
import type { CellHoverMeta, DraggableSourceData, PluginInjectionAPI } from '../../types';
import { TableCssClassName as ClassName } from '../../types';

import { ColumnControls } from './ColumnControls';
import { ColumnDropTargets } from './ColumnDropTargets';

interface Props {
	api?: PluginInjectionAPI;
	editorView: EditorView;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	getNode: () => PmNode;
	getScrollOffset?: () => number;
	hasHeaderRow?: boolean;
	headerRowHeight?: number;
	hoveredCell?: CellHoverMeta;
	hoveredRows?: number[];
	isChromelessEditor?: boolean;
	isInDanger?: boolean;
	isNumberColumnEnabled?: boolean;
	isResizing?: boolean;
	isTableHovered?: boolean;
	ordering?: TableColumnOrdering;
	selection?: Selection;
	stickyHeader?: RowStickyState;
	tableActive?: boolean;
	tableContainerWidth?: number;
	tableRef?: HTMLTableElement;
	tableWrapperHeight?: number;
}

const TableFloatingColumnControls = ({
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
	isChromelessEditor,
}: Props): React.JSX.Element | null => {
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
		const columnControlTopOffsetFromParent = '-12px';
		containerRef?.current?.style.setProperty('top', columnControlTopOffsetFromParent);
	} else {
		containerRef?.current?.style.removeProperty('top');
	}

	let anchorStyles = {};
	if (
		isAnchorSupported() &&
		expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) &&
		expValEquals('platform_editor_table_sticky_header_improvements', 'cohort', 'test_with_overflow')
	) {
		// cast here is due to CSSProperties missing valid positionAnchor property
		anchorStyles = {
			positionAnchor: tableRef.querySelector('tr')?.style.getPropertyValue('anchor-name'),
		} as React.CSSProperties;
	}

	return (
		<div
			ref={containerRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={
				ClassName.DRAG_COLUMN_CONTROLS_WRAPPER +
				(isChromelessEditor ? ' ' + ClassName.TABLE_CHROMELESS : '')
			}
			data-testid="table-floating-column-controls-wrapper"
			// anchor name is determined dynamically so can't use static styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={anchorStyles}
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
				api={api}
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
