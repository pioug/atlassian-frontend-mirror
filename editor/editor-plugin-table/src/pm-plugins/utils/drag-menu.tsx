import React from 'react';

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	addColumnAfter,
	addColumnBefore,
	addRowAfter,
	addRowBefore,
	backspace,
	deleteColumn,
	deleteRow,
	moveColumnLeft,
	moveColumnRight,
	moveRowDown,
	moveRowUp,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import type {
	Command,
	CommandDispatch,
	DropdownOptionT,
	GetEditorContainerWidth,
} from '@atlaskit/editor-common/types';
import type { AriaLiveElementAttributes } from '@atlaskit/editor-plugin-accessibility-utils';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Rect, TableMap } from '@atlaskit/editor-tables/table-map';
import SortAscendingIcon from '@atlaskit/icon/core/sort-ascending';
import SortDescendingIcon from '@atlaskit/icon/core/sort-descending';
import TableCellClearIcon from '@atlaskit/icon/core/table-cell-clear';
import TableColumnAddLeftIcon from '@atlaskit/icon/core/table-column-add-left';
import TableColumnAddRightIcon from '@atlaskit/icon/core/table-column-add-right';
import TableColumnDeleteIcon from '@atlaskit/icon/core/table-column-delete';
import TableColumnMoveLeftIcon from '@atlaskit/icon/core/table-column-move-left';
import TableColumnMoveRightIcon from '@atlaskit/icon/core/table-column-move-right';
import TableColumnsDistributeIcon from '@atlaskit/icon/core/table-columns-distribute';
import TableRowAddAboveIcon from '@atlaskit/icon/core/table-row-add-above';
import TableRowAddBelowIcon from '@atlaskit/icon/core/table-row-add-below';
import TableRowDeleteIcon from '@atlaskit/icon/core/table-row-delete';
import TableRowMoveDownIcon from '@atlaskit/icon/core/table-row-move-down';
import TableRowMoveUpIcon from '@atlaskit/icon/core/table-row-move-up';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import EditorLayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import HipchatChevronDoubleDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-double-down';
import HipchatChevronDoubleUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-double-up';
import type { NewIconProps, IconProps } from '@atlaskit/icon/types';

import type { DraggableData, DraggableType, PluginInjectionAPI, TableDirection } from '../../types';
import { AddColLeftIcon } from '../../ui/icons/AddColLeftIcon';
import { AddColRightIcon } from '../../ui/icons/AddColRightIcon';
import { AddRowAboveIcon } from '../../ui/icons/AddRowAboveIcon';
import { AddRowBelowIcon } from '../../ui/icons/AddRowBelowIcon';
import { getClosestSelectionRect } from '../../ui/toolbar';
import {
	deleteColumnsWithAnalytics,
	deleteRowsWithAnalytics,
	distributeColumnsWidthsWithAnalytics,
	emptyMultipleCellsWithAnalytics,
	insertColumnWithAnalytics,
	insertRowWithAnalytics,
	sortColumnWithAnalytics,
} from '../commands/commands-with-analytics';
import { moveSourceWithAnalytics } from '../drag-and-drop/commands-with-analytics';
import { getPluginState as getTablePluginState } from '../plugin-factory';
import { getNewResizeStateFromSelectedColumns } from '../table-resizing/utils/resize-state';

import {
	hasMergedCellsInSelection,
	hasMergedCellsWithColumnNextToColumnIndex,
	hasMergedCellsWithRowNextToRowIndex,
} from './merged-cells';
import { getSelectedColumnIndexes, getSelectedRowIndexes } from './selection';

export const getTargetIndex = (selectedIndexes: number[], direction: DraggableData['direction']) =>
	Math[direction < 0 ? 'min' : 'max'](...selectedIndexes) + direction;

export const canMove = (
	sourceType: DraggableType,
	direction: DraggableData['direction'],
	totalItemsOfSourceTypeCount: number,
	selection: Selection,
	selectionRect?: Rect,
) => {
	if (!selectionRect) {
		return false;
	}

	const isRow = sourceType === 'table-row';
	const selectedIndexes = isRow
		? getSelectedRowIndexes(selectionRect)
		: getSelectedColumnIndexes(selectionRect);
	const targetIndex = getTargetIndex(selectedIndexes, direction);

	const isValidTargetIndex = targetIndex >= 0 && targetIndex < totalItemsOfSourceTypeCount;
	if (!isValidTargetIndex) {
		return false;
	}

	// We can't move column when target has merged cells with other columns
	// We can't move row when target has merged cells with other rows
	const hasMergedCellsInTarget = isRow
		? hasMergedCellsWithRowNextToRowIndex(targetIndex, selection)
		: hasMergedCellsWithColumnNextToColumnIndex(targetIndex, selection);
	if (hasMergedCellsInTarget) {
		return false;
	}

	// We can't move if selection in the source is not a rectangle
	if (hasMergedCellsInSelection(selectedIndexes, isRow ? 'row' : 'column')(selection)) {
		return false;
	}

	return true;
};

const isDistributeColumnsEnabled = (state: EditorState) => {
	const rect = getClosestSelectionRect(state);
	if (rect) {
		const selectedColIndexes = getSelectedColumnIndexes(rect);
		return selectedColIndexes.length > 1;
	}
	return false;
};

export type DragMenuOptionIdType =
	| 'add_row_above'
	| 'add_row_below'
	| 'add_column_left'
	| 'add_column_right'
	| 'distribute_columns'
	| 'clear_cells'
	| 'delete_row'
	| 'delete_column'
	| 'move_column_left'
	| 'move_column_right'
	| 'move_row_up'
	| 'move_row_down'
	| 'sort_column_asc'
	| 'sort_column_desc';

export interface DragMenuConfig extends Omit<DropdownOptionT<Command>, 'icon'> {
	icon?: React.ComponentType<React.PropsWithChildren<NewIconProps>>;
	iconFallback?: React.ComponentType<React.PropsWithChildren<IconProps>>;
	id: DragMenuOptionIdType;
	keymap?: string;
}

const defaultSelectionRect = { left: 0, top: 0, right: 0, bottom: 0 };

export const getDragMenuConfig = (
	direction: TableDirection,
	getEditorContainerWidth: GetEditorContainerWidth,
	hasMergedCellsInTable: boolean,
	editorView: EditorView,
	api: PluginInjectionAPI | undefined | null,
	tableMap?: TableMap,
	index?: number,
	targetCellPosition?: number,
	selectionRect?: Rect,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	isHeaderRowRequired?: boolean,
	isTableScalingEnabled = false,
	isTableFixedColumnWidthsOptionEnabled = false,
	shouldUseIncreasedScalingPercent = false,
	ariaNotifyPlugin?: (
		message: string,
		ariaLiveElementAttributes?: AriaLiveElementAttributes,
	) => void,
	isCommentEditor = false,
): DragMenuConfig[] => {
	const { selection } = editorView.state;
	const { getIntl } = getTablePluginState(editorView.state);
	const addOptions =
		direction === 'row'
			? [
					{
						label: 'above',
						offset: 0,
						icon: () => (
							<TableRowAddAboveIcon
								LEGACY_fallbackIcon={AddRowAboveIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: addRowBefore,
					},
					{
						label: 'below',
						offset: 1,
						icon: () => (
							<TableRowAddBelowIcon
								LEGACY_fallbackIcon={AddRowBelowIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: addRowAfter,
					},
				]
			: [
					{
						label: 'left',
						offset: 0,
						icon: () => (
							<TableColumnAddLeftIcon
								LEGACY_fallbackIcon={AddColLeftIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: addColumnBefore,
					},
					{
						label: 'right',
						offset: 1,
						icon: () => (
							<TableColumnAddRightIcon
								LEGACY_fallbackIcon={AddColRightIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: addColumnAfter,
					},
				];
	const moveOptions =
		direction === 'row'
			? [
					{
						label: 'up',
						icon: () => (
							<TableRowMoveUpIcon
								LEGACY_fallbackIcon={ArrowUpIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: moveRowUp,
						canMove: canMove('table-row', -1, tableMap?.height ?? 0, selection, selectionRect),
						getOriginIndexes: getSelectedRowIndexes,
						getTargetIndex: (selectionRect: Rect) => selectionRect.top - 1,
					},
					{
						label: 'down',
						icon: () => (
							<TableRowMoveDownIcon
								LEGACY_fallbackIcon={ArrowDownIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: moveRowDown,
						canMove: canMove('table-row', 1, tableMap?.height ?? 0, selection, selectionRect),
						getOriginIndexes: getSelectedRowIndexes,
						getTargetIndex: (selectionRect: Rect) => selectionRect.bottom,
					},
				]
			: [
					{
						label: 'left',
						icon: () => (
							<TableColumnMoveLeftIcon
								LEGACY_fallbackIcon={ArrowLeftIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: moveColumnLeft,
						canMove: canMove('table-column', -1, tableMap?.width ?? 0, selection, selectionRect),
						getOriginIndexes: getSelectedColumnIndexes,
						getTargetIndex: (selectionRect: Rect) => selectionRect.left - 1,
					},
					{
						label: 'right',
						icon: () => (
							<TableColumnMoveRightIcon
								LEGACY_fallbackIcon={ArrowRightIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
						keymap: moveColumnRight,
						canMove: canMove('table-column', 1, tableMap?.width ?? 0, selection, selectionRect),
						getOriginIndexes: getSelectedColumnIndexes,
						getTargetIndex: (selectionRect: Rect) => selectionRect.right,
					},
				];
	const sortOptions =
		direction === 'column'
			? [
					{
						label: 'increasing',
						order: SortOrder.ASC,
						icon: () => (
							<SortAscendingIcon
								LEGACY_fallbackIcon={HipchatChevronDoubleUpIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
					},
					{
						label: 'decreasing',
						order: SortOrder.DESC,
						icon: () => (
							<SortDescendingIcon
								LEGACY_fallbackIcon={HipchatChevronDoubleDownIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
					},
				]
			: [];
	const sortConfigs = [
		...sortOptions.map(({ label, order, icon }) => ({
			id: `sort_column_${order}`,
			title: `Sort ${label}`,
			disabled: hasMergedCellsInTable,
			icon: icon,
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				sortColumnWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.TABLE_CONTEXT_MENU,
					index ?? 0,
					order,
				)(state, dispatch);
				return true;
			},
		})),
	];
	const restConfigs = [
		...addOptions.map(({ label, offset, icon, keymap }) => ({
			id: `add_${direction}_${label}`,
			title: `Add ${direction} ${label}`,
			icon: icon,
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				if (direction === 'row') {
					insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.TABLE_CONTEXT_MENU, {
						index: (index ?? 0) + offset,
						moveCursorToInsertedRow: true,
					})(state, dispatch);
				} else {
					insertColumnWithAnalytics(
						api,
						editorAnalyticsAPI,
						isTableScalingEnabled,
						isTableFixedColumnWidthsOptionEnabled,
						shouldUseIncreasedScalingPercent,
					)(INPUT_METHOD.TABLE_CONTEXT_MENU, (index ?? 0) + offset)(state, dispatch, editorView);
				}
				return true;
			},
			keymap: keymap && tooltip(keymap),
		})),
		direction === 'column'
			? {
					id: 'distribute_columns',
					title: 'Distribute columns',
					disabled: !isDistributeColumnsEnabled(editorView.state),
					onClick: (state: EditorState, dispatch?: CommandDispatch) => {
						const selectionRect = getClosestSelectionRect(state);
						if (selectionRect) {
							const newResizeState = getNewResizeStateFromSelectedColumns(
								selectionRect,
								state,
								editorView.domAtPos.bind(editorView),
								getEditorContainerWidth,
								isTableScalingEnabled,
								isTableFixedColumnWidthsOptionEnabled,
								isCommentEditor,
							);

							if (newResizeState) {
								distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI, api)(
									INPUT_METHOD.TABLE_CONTEXT_MENU,
									newResizeState,
								)(state, dispatch);
								return true;
							}
							return false;
						}
						return false;
					},
					icon: () => (
						<TableColumnsDistributeIcon
							LEGACY_fallbackIcon={EditorLayoutThreeEqualIcon}
							spacing={'spacious'}
							label={''}
						/>
					),
				}
			: undefined,
		{
			id: 'clear_cells',
			title: 'Clear cells',
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				emptyMultipleCellsWithAnalytics(editorAnalyticsAPI)(
					INPUT_METHOD.TABLE_CONTEXT_MENU,
					targetCellPosition,
				)(state, dispatch);
				return true;
			},
			icon: () => (
				<TableCellClearIcon LEGACY_fallbackIcon={CrossCircleIcon} spacing={'spacious'} label={''} />
			),
			keymap: tooltip(backspace),
		},
		{
			id: `delete_${direction}`,
			title: `Delete ${direction}`,
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				if (direction === 'row') {
					deleteRowsWithAnalytics(editorAnalyticsAPI)(
						INPUT_METHOD.TABLE_CONTEXT_MENU,
						selectionRect ?? defaultSelectionRect,
						!!isHeaderRowRequired,
					)(state, dispatch);
				} else {
					deleteColumnsWithAnalytics(
						editorAnalyticsAPI,
						api,
						isTableScalingEnabled,
						isTableFixedColumnWidthsOptionEnabled,
						shouldUseIncreasedScalingPercent,
						isCommentEditor,
					)(INPUT_METHOD.TABLE_CONTEXT_MENU, selectionRect ?? defaultSelectionRect)(
						state,
						dispatch,
						editorView,
					);
				}
				return true;
			},
			icon:
				direction === 'row'
					? () => (
							<TableRowDeleteIcon
								LEGACY_fallbackIcon={RemoveIcon}
								spacing={'spacious'}
								label={''}
							/>
						)
					: () => (
							<TableColumnDeleteIcon
								LEGACY_fallbackIcon={RemoveIcon}
								spacing={'spacious'}
								label={''}
							/>
						),
			keymap: direction === 'row' ? tooltip(deleteRow) : tooltip(deleteColumn),
		},
		...moveOptions.map(({ label, canMove, icon, keymap, getOriginIndexes, getTargetIndex }) => ({
			id: `move_${direction}_${label}`,
			title: `Move ${direction} ${label}`,
			disabled: !canMove,
			icon: icon,
			onClick: (state: EditorState, dispatch?: CommandDispatch) => {
				if (canMove) {
					requestAnimationFrame(() => {
						moveSourceWithAnalytics(editorAnalyticsAPI, ariaNotifyPlugin, getIntl)(
							INPUT_METHOD.TABLE_CONTEXT_MENU,
							`table-${direction}`,
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							getOriginIndexes(selectionRect!),
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							getTargetIndex(selectionRect!),
						)(editorView.state, editorView.dispatch);
					});
					return true;
				}
				return false;
			},
			keymap: keymap && tooltip(keymap),
		})),
	];

	const allConfigs = [...restConfigs];
	allConfigs.unshift(...sortConfigs);

	return allConfigs.filter(Boolean) as DragMenuConfig[];
};
