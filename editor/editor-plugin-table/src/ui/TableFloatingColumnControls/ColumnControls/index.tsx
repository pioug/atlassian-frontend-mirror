/* eslint-disable @atlaskit/design-system/prefer-primitives */
import type { MouseEvent } from 'react';
import React, { useCallback, useMemo, useRef } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';

import {
	clearHoverSelection,
	hoverCell,
	hoverColumns,
	selectColumn,
	selectColumns,
} from '../../../pm-plugins/commands';
import { toggleDragMenu } from '../../../pm-plugins/drag-and-drop/commands';
import type { TriggerType } from '../../../pm-plugins/drag-and-drop/types';
import { getRowsParams } from '../../../pm-plugins/utils/row-controls';
import { getSelectedColumnIndexes } from '../../../pm-plugins/utils/selection';
import type { TablePlugin } from '../../../tablePluginType';
import type { CellHoverMeta, HandleTypes } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import type { DragHandleAppearance } from '../../DragHandle';
import { DragHandle } from '../../DragHandle';

interface ColumnControlsProps {
	colWidths?: (number | undefined)[];
	editorView: EditorView;
	getScrollOffset?: () => number;
	hasHeaderColumn?: boolean;
	hoveredCell?: CellHoverMeta;
	isDragging?: boolean;
	isInDanger?: boolean;
	isNumberColumnEnabled?: boolean;
	isTableHovered?: boolean;
	localId?: string;
	rowHeights?: number[];
	stickyTop?: number;
	tableActive?: boolean;
	tableContainerWidth?: number;
	tableRef: HTMLTableElement;
}

const getSelectedColumns = (selection: Selection) => {
	if (selection instanceof CellSelection && selection.isColSelection()) {
		const rect = getSelectionRect(selection);
		if (!rect) {
			return [];
		}
		return getSelectedColumnIndexes(rect);
	}
	return [];
};

export const ColumnControls = ({
	editorView,
	tableActive,
	tableRef,
	hoveredCell,
	stickyTop,
	localId,
	isInDanger,
	rowHeights,
	colWidths,
	isTableHovered,
	tableContainerWidth,
	isNumberColumnEnabled,
	isDragging,
	getScrollOffset,
	api,
}: ColumnControlsProps & { api?: ExtractInjectionAPI<TablePlugin> }) => {
	const columnControlsRef = useRef<HTMLDivElement>(null);
	const { selection } = useSharedPluginStateWithSelector(api, ['selection'], (states) => ({
		selection: states.selectionState?.selection,
	}));

	const widths =
		colWidths
			?.map((width) =>
				// when there is sticky header, a `margin-right: -1px` applied to `tr.sticky th` so it causes colWidths to be 1px wider
				// we need to reduce the width by 1px to avoid misalignment of column controls.
				width ? (stickyTop ? `${width - 2}px` : `${width - 1}px`) : '0px',
			)
			.join(' ') ?? '0px';
	// TODO: ED-26961 - reusing getRowsParams here because it's generic enough to work for columns -> rename
	const columnParams = getRowsParams(colWidths ?? []);
	const colIndex = hoveredCell?.colIndex;
	const selectedColIndexes = getSelectedColumns(selection || editorView.state.selection);

	const firstRow = tableRef.querySelector('tr');
	const hasHeaderRow = firstRow ? firstRow.getAttribute('data-header-row') : false;

	const rowControlStickyTop = 45;
	const marginTop = hasHeaderRow && stickyTop !== undefined ? (rowControlStickyTop ?? 0) : 0;

	const handleClick = useCallback(
		(event: MouseEvent) => {
			const { state, dispatch } = editorView;

			const isClickOutsideSelectedCols =
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				selectedColIndexes.length >= 1 && !selectedColIndexes.includes(colIndex!);

			if (!selectedColIndexes || selectedColIndexes.length === 0 || isClickOutsideSelectedCols) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				selectColumn(colIndex!, event.shiftKey)(state, dispatch);
			}

			if (
				selectedColIndexes.length > 1 &&
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				selectedColIndexes.includes(colIndex!) &&
				!event.shiftKey
			) {
				selectColumns(selectedColIndexes)(state, dispatch);
			}
		},
		[colIndex, selectedColIndexes, editorView],
	);

	const handleMouseOver = useCallback(() => {
		const { state, dispatch } = editorView;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		hoverColumns([colIndex!])(state, dispatch);
	}, [colIndex, editorView]);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			const isParentDragControls = (e.nativeEvent.target as Element).closest(
				`.${ClassName.DRAG_COLUMN_CONTROLS}`,
			);
			const colIndex = (e.nativeEvent.target as Element).getAttribute('data-start-index');

			// avoid updating if event target is not related
			if (!isParentDragControls || !colIndex) {
				return;
			}

			// update hovered cell location
			const { state, dispatch } = editorView;
			if (tableActive) {
				// For context:  Whenever we mouse over a column or row drag handle, we will ALWAYS be hovering over the 0 index
				// of the opposite dimension. For example; here when we mouse over the column drag handle then we're technically
				// also hovering over row 0 index. And vice-versa with rows. This means we don't need to worry about knowing the
				// current row index. We can just force it to 0.
				hoverCell(0, Number(colIndex))(state, dispatch);
			}
		},
		[editorView, tableActive],
	);

	const handleMouseOut = useCallback(() => {
		if (tableActive) {
			const { state, dispatch } = editorView;
			clearHoverSelection()(state, dispatch);
		}
	}, [editorView, tableActive]);

	const toggleDragMenuHandler = useCallback(
		(
			trigger: TriggerType,
			event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined,
		) => {
			const { state, dispatch } = editorView;
			if (event?.shiftKey) {
				return;
			}
			toggleDragMenu(undefined, 'column', colIndex, trigger)(state, dispatch);
		},
		[editorView, colIndex],
	);

	const colIndexes = useMemo(() => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return [colIndex!];
	}, [colIndex]);

	if (stickyTop && columnControlsRef.current) {
		columnControlsRef.current.scrollLeft = getScrollOffset?.() ?? 0;
	}

	const generateHandleByType = (
		type: HandleTypes,
		appearance: DragHandleAppearance,
		gridColumn: string,
		indexes: number[],
	) => {
		const isHover = type === 'hover';
		const isPlaceholder = appearance === 'placeholder';
		const previewHeight = rowHeights?.reduce((sum, cur) => sum + cur, 0) ?? 0;

		const previewWidth =
			colWidths?.reduce<number>(
				(sum, v, i) => sum + (v ?? tableCellMinWidth) * (indexes.includes(i) ? 1 : 0),
				0,
			) ?? tableCellMinWidth;

		return (
			<div
				contentEditable={false}
				key={type}
				style={{
					gridColumn,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					gridRow: '1',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					justifyContent: 'center',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'center',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					height: 'fit-content',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					placeSelf: 'center',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					zIndex: 99,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '100%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'relative',
				}}
				data-testid={`table-floating-column-${
					isHover ? colIndex : isPlaceholder ? appearance : selectedColIndexes[0]
				}-drag-handle`}
			>
				<DragHandle
					isDragMenuTarget={!isHover}
					direction="column"
					tableLocalId={localId || ''}
					indexes={indexes}
					hoveredCell={hoveredCell}
					previewWidth={previewWidth}
					forceDefaultHandle={!isHover}
					previewHeight={previewHeight}
					appearance={appearance}
					onClick={handleClick}
					onMouseOver={handleMouseOver}
					onMouseOut={handleMouseOut}
					toggleDragMenu={toggleDragMenuHandler}
					editorView={editorView}
				/>
			</div>
		);
	};

	const columnHandles = () => {
		const handles = [];
		const isColumnSelected = selectedColIndexes.length > 0;
		const isEntireTableSelected = (colWidths || []).length > selectedColIndexes.length;

		if (!tableActive) {
			return null;
		}

		const selectedAppearance =
			isColumnSelected && isEntireTableSelected
				? isInDanger
					? 'danger'
					: 'selected'
				: 'placeholder';

		// placeholder / selected need to always render at least one handle
		// so it can be focused via keyboard shortcuts
		handles.push(
			generateHandleByType(
				'selected',
				selectedAppearance,
				// always position placeholder in first column to avoid overflow issues
				selectedAppearance === 'placeholder'
					? '1 / span 1'
					: `${selectedColIndexes[0] + 1} / span ${selectedColIndexes.length}`,
				selectedColIndexes,
			),
		);

		if (
			hoveredCell &&
			isTableHovered &&
			colIndex !== undefined &&
			!selectedColIndexes.includes(colIndex)
		) {
			handles.push(
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				generateHandleByType('hover', 'default', `${colIndex! + 1} / span 1`, colIndexes),
			);
		}

		return handles;
	};

	const containerWidth =
		isNumberColumnEnabled && tableContainerWidth
			? tableContainerWidth - akEditorTableNumberColumnWidth
			: tableContainerWidth;

	return (
		// eslint-disable-next-line @atlassian/a11y/no-static-element-interactions
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={ClassName.DRAG_COLUMN_CONTROLS}
			onMouseMove={handleMouseMove}
		>
			<div
				ref={columnControlsRef}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={ClassName.DRAG_COLUMN_CONTROLS_INNER}
				data-testid="table-floating-column-controls"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					gridTemplateColumns: widths,
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginTop,
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					width: stickyTop ? containerWidth : undefined,
					overflowX: stickyTop ? 'hidden' : 'visible',
					pointerEvents: isDragging ? 'none' : undefined,
				}}
			>
				{columnParams.map(({ startIndex, endIndex }, index) => (
					<div
						style={{
							gridColumn: `${startIndex + 1} / span 1`,
						}}
						data-start-index={startIndex}
						data-end-index={endIndex}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT_WRAPPER}
						contentEditable={false}
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						key={index}
					>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={columnParams.length - 1 === index ? { right: '0' } : {}}
						/>
					</div>
				))}
				{columnHandles()}
			</div>
		</div>
	);
};
