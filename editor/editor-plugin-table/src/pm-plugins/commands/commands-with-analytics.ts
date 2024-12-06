import type { IntlShape } from 'react-intl-next/src/types';

import type { TableLayout } from '@atlaskit/adf-schema';
import { tableBackgroundColorPalette } from '@atlaskit/adf-schema';
import type { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import type {
	AnalyticsEventPayload,
	CHANGE_ALIGNMENT_REASON,
	EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
	TABLE_ACTION,
	TABLE_DISPLAY_MODE,
} from '@atlaskit/editor-common/analytics';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import type { Command, GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { type Rect, TableMap } from '@atlaskit/editor-tables/table-map';
import {
	findCellClosestToPos,
	findCellRectClosestToPos,
	getSelectionRect,
} from '@atlaskit/editor-tables/utils';

import type {
	AlignmentOptions,
	InsertRowMethods,
	InsertRowOptions,
	PluginInjectionAPI,
	RowInsertPosition,
} from '../../types';
import { getPluginState } from '../plugin-factory';
import { distributeColumnsWidths } from '../table-resizing/commands';
import type { ResizeStateWithAnalytics } from '../table-resizing/utils';
import { deleteRows, mergeCells } from '../transforms';
import { checkIfNumberColumnEnabled, getSelectedCellInfo, getSelectedTableInfo } from '../utils';
import { withEditorAnalyticsAPI } from '../utils/analytics';

import { clearMultipleCells } from './clear';
import { wrapTableInExpand } from './collapse';
import { changeColumnWidthByStep } from './column-resize';
import { deleteColumnsCommand } from './delete';
import { setTableDisplayMode } from './display-mode';
import { insertColumn, insertRow } from './insert';
import {
	deleteTable,
	deleteTableIfSelected,
	getTableSelectionType,
	setMultipleCellAttrs,
	setTableAlignment,
	setTableAlignmentWithTableContentWithPos,
} from './misc';
import { sortByColumn } from './sort';
import { splitCell } from './split-cell';
import { toggleHeaderColumn, toggleHeaderRow, toggleNumberColumn } from './toggle';

// #region Analytics wrappers
export const emptyMultipleCellsWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.KEYBOARD
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		targetCellPosition?: number,
	) =>
		withEditorAnalyticsAPI(({ selection }) => {
			const { horizontalCells, verticalCells, totalRowCount, totalColumnCount } =
				getSelectedCellInfo(selection);

			return {
				action: TABLE_ACTION.CLEARED,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					horizontalCells,
					verticalCells,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)(clearMultipleCells(targetCellPosition));

export const mergeCellsWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | null | undefined) =>
	(inputMethod: INPUT_METHOD.CONTEXT_MENU | INPUT_METHOD.FLOATING_TB) =>
		withEditorAnalyticsAPI(({ selection }) => {
			const { horizontalCells, verticalCells, totalCells, totalRowCount, totalColumnCount } =
				getSelectedCellInfo(selection);

			return {
				action: TABLE_ACTION.MERGED,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					horizontalCells,
					verticalCells,
					totalCells,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				dispatch(mergeCells(state.tr));
			}
			return true;
		});

export const splitCellWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(inputMethod: INPUT_METHOD.CONTEXT_MENU | INPUT_METHOD.FLOATING_TB) =>
		withEditorAnalyticsAPI(({ selection }) => {
			const { totalRowCount, totalColumnCount } = getSelectedCellInfo(selection);
			const cell = findCellClosestToPos(selection.$anchor);
			if (cell) {
				const { rowspan: verticalCells, colspan: horizontalCells } = cell.node.attrs;

				return {
					action: TABLE_ACTION.SPLIT,
					actionSubject: ACTION_SUBJECT.TABLE,
					actionSubjectId: null,
					attributes: {
						inputMethod,
						horizontalCells,
						verticalCells,
						totalCells: horizontalCells * verticalCells,
						totalRowCount,
						totalColumnCount,
					},
					eventType: EVENT_TYPE.TRACK,
				};
			}
			return;
		})(editorAnalyticsAPI)(splitCell);

export const setColorWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		cellColor: string,
		editorView?: EditorView | null,
	) =>
		withEditorAnalyticsAPI(({ selection }) => {
			const { horizontalCells, verticalCells, totalCells, totalRowCount, totalColumnCount } =
				getSelectedCellInfo(selection);

			return {
				action: TABLE_ACTION.COLORED,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					cellColor: (
						tableBackgroundColorPalette.get(cellColor.toLowerCase()) || cellColor
					).toLowerCase(),
					horizontalCells,
					verticalCells,
					totalCells,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)(setMultipleCellAttrs({ background: cellColor }, editorView));

export const addRowAroundSelection =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(side: RowInsertPosition): Command =>
	(state, dispatch) => {
		const { selection } = state;
		const isCellSelection = selection instanceof CellSelection;
		const rect = isCellSelection
			? getSelectionRect(selection)
			: findCellRectClosestToPos(selection.$from);

		if (!rect) {
			return false;
		}

		const position = isCellSelection && side === 'TOP' ? rect.top : rect.bottom - 1;

		const offset = side === 'BOTTOM' ? 1 : 0;

		return insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT, {
			index: position + offset,
			moveCursorToInsertedRow: false,
		})(state, dispatch);
	};

export const insertRowWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(inputMethod: InsertRowMethods, options: InsertRowOptions) =>
		withEditorAnalyticsAPI((state) => {
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
			return {
				action: TABLE_ACTION.ADDED_ROW,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					position: options.index,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)(insertRow(options.index, options.moveCursorToInsertedRow));

export const changeColumnWidthByStepWithAnalytics =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		api: PluginInjectionAPI | undefined | null,
	) =>
	(
		stepSize: number,
		getEditorContainerWidth: GetEditorContainerWidth,
		isTableScalingEnabled: boolean,
		isTableFixedColumnWidthsOptionEnabled: boolean,
		isCommentEditor: boolean,
		inputMethod: INPUT_METHOD.SHORTCUT,
		ariaNotify?: (message: string) => void,
		getIntl?: () => IntlShape,
	) =>
		withEditorAnalyticsAPI((state) => {
			const { table, totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
			const {
				hoveredCell: { colIndex },
			} = getPluginState(state);

			return {
				action: TABLE_ACTION.COLUMN_RESIZED,
				actionSubject: ACTION_SUBJECT.TABLE,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					colIndex,
					resizedDelta: stepSize,
					isLastColumn: colIndex === totalColumnCount - 1,
					tableWidth: table?.node.attrs.width,
					inputMethod,
					totalRowCount,
					totalColumnCount,
				},
			};
		})(editorAnalyticsAPI)(
			changeColumnWidthByStep({
				stepSize: stepSize,
				getEditorContainerWidth: getEditorContainerWidth,
				isTableScalingEnabled,
				isTableFixedColumnWidthsOptionEnabled,
				isCommentEditor,
				ariaNotify: ariaNotify,
				getIntl: getIntl,
				api,
			}),
		);

export const insertColumnWithAnalytics =
	(
		api: PluginInjectionAPI | undefined | null,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		isTableScalingEnabled = false,
		isTableFixedColumnWidthsOptionEnabled = false,
		shouldUseIncreasedScalingPercent = false,
		isCommentEditor = false,
	) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		position: number,
	) =>
		withEditorAnalyticsAPI((state) => {
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
			return {
				action: TABLE_ACTION.ADDED_COLUMN,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					position,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)(
			insertColumn(
				api,
				isTableScalingEnabled,
				isTableFixedColumnWidthsOptionEnabled,
				shouldUseIncreasedScalingPercent,
				isCommentEditor,
			)(position),
		);

export const deleteRowsWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		rect: Rect,
		isHeaderRowRequired: boolean,
	) =>
		withEditorAnalyticsAPI(({ selection }) => {
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);

			return {
				action: TABLE_ACTION.DELETED_ROW,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					position: rect.top,
					count: rect.bottom - rect.top,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				dispatch(deleteRows(rect, isHeaderRowRequired)(state.tr));
			}
			return true;
		});

export const deleteColumnsWithAnalytics =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabled = false,
		isTableFixedColumnWidthsOptionEnabled = false,
		shouldUseIncreasedScalingPercent = false,
		isCommentEditor = false,
	) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.SHORTCUT
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		rect: Rect,
	) =>
		withEditorAnalyticsAPI(({ selection }) => {
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);

			return {
				action: TABLE_ACTION.DELETED_COLUMN,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					position: rect.left,
					count: rect.right - rect.left,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)(
			deleteColumnsCommand(
				rect,
				api,
				isTableScalingEnabled,
				isTableFixedColumnWidthsOptionEnabled,
				shouldUseIncreasedScalingPercent,
				isCommentEditor,
			),
		);

export const deleteSelectedRowsOrColumnsWithAnalyticsViaShortcut =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabled?: boolean,
		isTableFixedColumnWidthsOptionEnabled?: boolean,
		shouldUseIncreasedScalingPercent?: boolean,
	): Command =>
	(state, dispatch) => {
		const { selection } = state;
		const isCellSelection = selection instanceof CellSelection;
		if (!isCellSelection) {
			return false;
		}

		const rect = getSelectionRect(selection);
		if (!rect) {
			return false;
		}

		const selectionType = getTableSelectionType(selection);
		if (selectionType === 'row') {
			const { pluginConfig } = getPluginState(state);
			const isHeaderRowRequired = pluginConfig.isHeaderRowRequired || false;

			return deleteRowsWithAnalytics(editorAnalyticsAPI)(
				INPUT_METHOD.SHORTCUT,
				rect,
				isHeaderRowRequired,
			)(state, dispatch);
		} else if (selectionType === 'column') {
			return deleteColumnsWithAnalytics(
				editorAnalyticsAPI,
				api,
				isTableScalingEnabled,
				isTableFixedColumnWidthsOptionEnabled,
				shouldUseIncreasedScalingPercent,
			)(INPUT_METHOD.SHORTCUT, rect)(state, dispatch);
		} else {
			return false;
		}
	};

const getTableDeletedAnalytics = (
	selection: Selection,
	inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.KEYBOARD,
): AnalyticsEventPayload => {
	const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
	return {
		action: TABLE_ACTION.DELETED,
		actionSubject: ACTION_SUBJECT.TABLE,
		attributes: {
			inputMethod,
			totalRowCount,
			totalColumnCount,
		},
		eventType: EVENT_TYPE.TRACK,
	};
};

export const deleteTableWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
) =>
	withEditorAnalyticsAPI(({ selection }) =>
		getTableDeletedAnalytics(selection, INPUT_METHOD.FLOATING_TB),
	)(editorAnalyticsAPI)(deleteTable);

export const deleteTableIfSelectedWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(inputMethod: INPUT_METHOD.FLOATING_TB | INPUT_METHOD.KEYBOARD) =>
		withEditorAnalyticsAPI(({ selection }) => getTableDeletedAnalytics(selection, inputMethod))(
			editorAnalyticsAPI,
		)(deleteTableIfSelected);

export const toggleHeaderRowWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
) =>
	withEditorAnalyticsAPI((state) => {
		const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
		const { isHeaderRowEnabled } = getPluginState(state);

		return {
			action: TABLE_ACTION.TOGGLED_HEADER_ROW,
			actionSubject: ACTION_SUBJECT.TABLE,
			actionSubjectId: null,
			attributes: {
				newState: !isHeaderRowEnabled,
				totalRowCount,
				totalColumnCount,
			},
			eventType: EVENT_TYPE.TRACK,
		};
	})(editorAnalyticsAPI)(toggleHeaderRow);

export const toggleHeaderColumnWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
) =>
	withEditorAnalyticsAPI((state) => {
		const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
		const { isHeaderColumnEnabled } = getPluginState(state);

		return {
			action: TABLE_ACTION.TOGGLED_HEADER_COLUMN,
			actionSubject: ACTION_SUBJECT.TABLE,
			actionSubjectId: null,
			attributes: {
				newState: !isHeaderColumnEnabled,
				totalRowCount,
				totalColumnCount,
			},
			eventType: EVENT_TYPE.TRACK,
		};
	})(editorAnalyticsAPI)(toggleHeaderColumn);

export const toggleNumberColumnWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
) =>
	withEditorAnalyticsAPI((state) => {
		const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
		return {
			action: TABLE_ACTION.TOGGLED_NUMBER_COLUMN,
			actionSubject: ACTION_SUBJECT.TABLE,
			actionSubjectId: null,
			attributes: {
				newState: !checkIfNumberColumnEnabled(state.selection),
				totalRowCount,
				totalColumnCount,
			},
			eventType: EVENT_TYPE.TRACK,
		};
	})(editorAnalyticsAPI)(toggleNumberColumn);

export const sortColumnWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		columnIndex: number,
		sortOrder: SortOrder,
	) =>
		withEditorAnalyticsAPI((state) => {
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
			return {
				action: TABLE_ACTION.SORTED_COLUMN,
				actionSubject: ACTION_SUBJECT.TABLE,
				attributes: {
					inputMethod,
					totalRowCount,
					totalColumnCount,
					position: columnIndex,
					sortOrder,
					mode: 'editor',
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)(sortByColumn(columnIndex, sortOrder));

export const distributeColumnsWidthsWithAnalytics =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		api: PluginInjectionAPI | undefined | null,
	) =>
	(
		inputMethod:
			| INPUT_METHOD.CONTEXT_MENU
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TABLE_CONTEXT_MENU,
		{ resizeState, table, attributes }: ResizeStateWithAnalytics,
	) => {
		return withEditorAnalyticsAPI(() => {
			return {
				action: TABLE_ACTION.DISTRIBUTED_COLUMNS_WIDTHS,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					...attributes,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				distributeColumnsWidths(resizeState, table, api)(state, dispatch);
			}
			return true;
		});
	};

export const wrapTableInExpandWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
) =>
	withEditorAnalyticsAPI((state) => {
		const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
		return {
			action: TABLE_ACTION.COLLAPSED,
			actionSubject: ACTION_SUBJECT.TABLE,
			actionSubjectId: null,
			attributes: {
				totalRowCount,
				totalColumnCount,
			},
			eventType: EVENT_TYPE.TRACK,
		};
	})(editorAnalyticsAPI)(wrapTableInExpand);

export const toggleFixedColumnWidthsOptionAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
	inputMethod: INPUT_METHOD.FLOATING_TB,
) =>
	withEditorAnalyticsAPI((state) => {
		const { table, totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);

		let previousDisplayMode: TABLE_DISPLAY_MODE;
		let newDisplayMode: TABLE_DISPLAY_MODE;

		switch (table?.node.attrs.displayMode) {
			case 'fixed':
				previousDisplayMode = TABLE_DISPLAY_MODE.FIXED;
				newDisplayMode = TABLE_DISPLAY_MODE.DEFAULT;
				break;
			case 'default':
				previousDisplayMode = TABLE_DISPLAY_MODE.DEFAULT;
				newDisplayMode = TABLE_DISPLAY_MODE.FIXED;
				break;
			case null:
			default:
				previousDisplayMode = TABLE_DISPLAY_MODE.INITIAL;
				newDisplayMode = TABLE_DISPLAY_MODE.FIXED;
		}

		return {
			action: TABLE_ACTION.CHANGED_DISPLAY_MODE,
			actionSubject: ACTION_SUBJECT.TABLE,
			attributes: {
				inputMethod,
				previousDisplayMode,
				newDisplayMode,
				tableWidth: table?.node.attrs.width,
				totalRowCount,
				totalColumnCount,
			},
			eventType: EVENT_TYPE.TRACK,
		};
	})(editorAnalyticsAPI)(editorCommandToPMCommand(setTableDisplayMode));

export const setTableAlignmentWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null, isCommentEditor: boolean) =>
	(
		newAlignment: AlignmentOptions,
		// previous alignment could be a breakout value, if so use 'null' to indicate alignment was not previously set
		previousAlignment: TableLayout,
		inputMethod: INPUT_METHOD.FLOATING_TB,
		reason: CHANGE_ALIGNMENT_REASON,
	) =>
		withEditorAnalyticsAPI((state) => {
			const { table, totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);

			return {
				action: TABLE_ACTION.CHANGED_ALIGNMENT,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					tableWidth: table?.node.attrs.width,
					newAlignment,
					previousAlignment:
						previousAlignment === 'center' || previousAlignment === 'align-start'
							? previousAlignment
							: null,
					totalRowCount,
					totalColumnCount,
					inputMethod,
					reason,
				},
			};
		})(editorAnalyticsAPI)(
			editorCommandToPMCommand(setTableAlignment(newAlignment, isCommentEditor)),
		);

export const setTableAlignmentWithTableContentWithPosWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		newAlignment: AlignmentOptions,
		previousAlignment: AlignmentOptions | null,
		tableNodeWithPos: NodeWithPos,
		inputMethod: INPUT_METHOD.AUTO,
		reason: CHANGE_ALIGNMENT_REASON,
	) =>
		withEditorAnalyticsAPI(() => {
			const map = TableMap.get(tableNodeWithPos.node);
			const totalRowCount = map.height;
			const totalColumnCount = map.width;

			const attributes = {
				tableWidth: tableNodeWithPos.node.attrs.width,
				newAlignment: newAlignment,
				previousAlignment: previousAlignment,
				totalRowCount: totalRowCount,
				totalColumnCount: totalColumnCount,
				inputMethod: inputMethod,
				reason: reason,
			};

			return {
				action: TABLE_ACTION.CHANGED_ALIGNMENT,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				eventType: EVENT_TYPE.TRACK,
				attributes: attributes,
			};
		})(editorAnalyticsAPI)(
			editorCommandToPMCommand(
				setTableAlignmentWithTableContentWithPos(newAlignment, tableNodeWithPos),
			),
		);
