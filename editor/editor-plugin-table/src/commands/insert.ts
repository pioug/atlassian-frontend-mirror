// #region Imports
import { AddColumnStep } from '@atlaskit/custom-steps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	TABLE_OVERFLOW_CHANGE_TRIGGER,
} from '@atlaskit/editor-common/analytics';
import type { Command, EditorCommand } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
	addColumnAt as addColumnAtPMUtils,
	addRowAt,
	findTable,
	selectedRect,
} from '@atlaskit/editor-tables/utils';

import { updateRowOrColumnMovedTransform } from '../pm-plugins/analytics/commands';
import { META_KEYS } from '../pm-plugins/table-analytics';
import { rescaleColumns } from '../transforms/column-width';
import type { PluginInjectionAPI } from '../types';
import { checkIfHeaderRowEnabled, copyPreviousRow, createTableWithWidth } from '../utils';
import { getAllowAddColumnCustomStep } from '../utils/get-allow-add-column-custom-step';

function addColumnAtCustomStep(column: number) {
	return (tr: Transaction) => {
		const table = findTable(tr.selection);
		if (table) {
			return tr.step(AddColumnStep.create(tr.doc, table.pos, column));
		}
		return tr;
	};
}

export function addColumnAt(
	api: PluginInjectionAPI | undefined | null,
	isTableScalingEnabled = false,
	isCellBackgroundDuplicated?: boolean,
	isTableFixedColumnWidthsOptionEnabled?: boolean,
	shouldUseIncreasedScalingPercent?: boolean,
	isCommentEditor?: boolean,
) {
	return (
		column: number,
		allowAddColumnCustomStep: boolean = false,
		view: EditorView | undefined,
	) => {
		return (tr: Transaction) => {
			let updatedTr = tr;
			if (allowAddColumnCustomStep) {
				updatedTr = addColumnAtCustomStep(column)(updatedTr);
			} else {
				updatedTr = addColumnAtPMUtils(column, isCellBackgroundDuplicated)(updatedTr);
			}
			const table = findTable(updatedTr.selection);
			if (table) {
				// [ED-8288] Update colwidths manually to avoid multiple dispatch in TableComponent
				updatedTr = rescaleColumns(
					isTableScalingEnabled,
					isTableFixedColumnWidthsOptionEnabled,
					shouldUseIncreasedScalingPercent,
					api,
					isCommentEditor,
				)(
					table,
					view,
				)(updatedTr);
			}

			if (view) {
				updatedTr = updateRowOrColumnMovedTransform({ type: 'column' }, 'addRowOrColumn')(
					view.state,
					updatedTr,
				);
			}

			updatedTr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
				name: TABLE_OVERFLOW_CHANGE_TRIGGER.ADDED_COLUMN,
			});

			return updatedTr;
		};
	};
}

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column before the column with the selection.
export const addColumnBefore =
	(
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabled = false,
		isCellBackgroundDuplicated = false,
		isTableFixedColumnWidthsOptionEnabled = false,
		shouldUseIncreasedScalingPercent = false,
		isCommentEditor = false,
	): Command =>
	(state, dispatch, view) => {
		const table = findTable(state.selection);
		if (!table) {
			return false;
		}
		if (dispatch) {
			let rect = selectedRect(state);
			dispatch(
				addColumnAt(
					api,
					isTableScalingEnabled,
					isCellBackgroundDuplicated,
					isTableFixedColumnWidthsOptionEnabled,
					shouldUseIncreasedScalingPercent,
					isCommentEditor,
				)(
					rect.left,
					getAllowAddColumnCustomStep(state),
					view,
				)(state.tr),
			);
		}
		return true;
	};

// :: (EditorState, dispatch: ?(tr: Transaction)) → bool
// Command to add a column after the column with the selection.
export const addColumnAfter =
	(
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabled?: boolean,
		isCellBackgroundDuplicated?: boolean,
		isTableFixedColumnWidthsOptionEnabled?: boolean,
		shouldUseIncreasedScalingPercent?: boolean,
		isCommentEditor?: boolean,
	): Command =>
	(state, dispatch, view) => {
		const table = findTable(state.selection);
		if (!table) {
			return false;
		}

		if (dispatch) {
			let rect = selectedRect(state);
			dispatch(
				addColumnAt(
					api,
					isTableScalingEnabled,
					isCellBackgroundDuplicated,
					isTableFixedColumnWidthsOptionEnabled,
					shouldUseIncreasedScalingPercent,
					isCommentEditor,
				)(
					rect.right,
					getAllowAddColumnCustomStep(state),
					view,
				)(state.tr),
			);
		}
		return true;
	};

export const insertColumn =
	(
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabled = false,
		isCellBackgroundDuplicated?: boolean,
		isTableFixedColumnWidthsOptionEnabled?: boolean,
		shouldUseIncreasedScalingPercent?: boolean,
		isCommentEditor?: boolean,
	) =>
	(column: number): Command =>
	(state, dispatch, view) => {
		let tr = addColumnAt(
			api,
			isTableScalingEnabled,
			isCellBackgroundDuplicated,
			isTableFixedColumnWidthsOptionEnabled,
			shouldUseIncreasedScalingPercent,
			isCommentEditor,
		)(
			column,
			getAllowAddColumnCustomStep(state),
			view,
		)(state.tr);
		const table = findTable(tr.selection);
		if (!table) {
			return false;
		}
		// move the cursor to the newly created column
		const pos = TableMap.get(table.node).positionAt(0, column, table.node);

		if (dispatch) {
			dispatch(tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos))));
		}
		return true;
	};

export const insertRow =
	(row: number, moveCursorToTheNewRow: boolean, isCellBackgroundDuplicated?: boolean): Command =>
	(state, dispatch) => {
		// Don't clone the header row
		const headerRowEnabled = checkIfHeaderRowEnabled(state.selection);
		const clonePreviousRow = (headerRowEnabled && row > 1) || (!headerRowEnabled && row > 0);

		// When the table have header row
		// we should not add row on the position zero
		if (row === 0 && headerRowEnabled) {
			return false;
		}

		const tr = clonePreviousRow
			? copyPreviousRow(state.schema)(row)(state.tr)
			: addRowAt(row, undefined, isCellBackgroundDuplicated)(state.tr);

		const table = findTable(tr.selection);
		if (!table) {
			return false;
		}
		if (dispatch) {
			const { selection } = state;
			if (moveCursorToTheNewRow) {
				// move the cursor to the newly created row
				const pos = TableMap.get(table.node).positionAt(row, 0, table.node);
				tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos)));
			} else {
				tr.setSelection(selection.map(tr.doc, tr.mapping));
			}

			updateRowOrColumnMovedTransform(
				{
					type: 'row',
				},
				'addRowOrColumn',
			)(state, tr);

			dispatch(tr);
		}
		return true;
	};

export const createTable =
	(
		isTableScalingEnabled?: boolean,
		isTableAlignmentEnabled?: boolean,
		isFullWidthModeEnabled?: boolean,
		editorAnalyticsAPI?: EditorAnalyticsAPI | undefined | null,
		isCommentEditor?: boolean,
		isChromelessEditor?: boolean,
		isTableResizingEnabled?: boolean,
	): Command =>
	(state, dispatch) => {
		const table = createTableWithWidth({
			isTableScalingEnabled,
			isTableAlignmentEnabled,
			isFullWidthModeEnabled,
			isCommentEditor,
			isChromelessEditor,
			isTableResizingEnabled,
		})(state.schema);

		if (dispatch) {
			const tr = safeInsert(table)(state.tr).scrollIntoView();
			if (editorAnalyticsAPI) {
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.TABLE,
					attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
					eventType: EVENT_TYPE.TRACK,
				})(tr);
			}
			dispatch(tr);
		}

		return true;
	};

export const insertTableWithSize =
	(
		isFullWidthModeEnabled?: boolean,
		isTableScalingEnabled?: boolean,
		isTableAlignmentEnabled?: boolean,
		editorAnalyticsAPI?: EditorAnalyticsAPI,
		isCommentEditor?: boolean,
		isChromelessEditor?: boolean,
	) =>
	(rowsCount: number, colsCount: number, inputMethod?: INPUT_METHOD.PICKER): EditorCommand => {
		return ({ tr }) => {
			const tableNode = createTableWithWidth({
				isTableScalingEnabled,
				isFullWidthModeEnabled,
				isTableAlignmentEnabled,
				isCommentEditor,
				isChromelessEditor,
				createTableProps: {
					rowsCount: rowsCount,
					colsCount: colsCount,
				},
			})(tr.doc.type.schema);

			const newTr = safeInsert(tableNode)(tr).scrollIntoView();
			if (inputMethod) {
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.TABLE,
					attributes: {
						inputMethod: inputMethod,
						totalRowCount: rowsCount,
						totalColumnCount: colsCount,
					},
					eventType: EVENT_TYPE.TRACK,
				})(newTr);
			}
			return newTr;
		};
	};
