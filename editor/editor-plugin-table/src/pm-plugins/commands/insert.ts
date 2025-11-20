// #region Imports
import { AddColumnStep } from '@atlaskit/custom-steps';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	TABLE_OVERFLOW_CHANGE_TRIGGER,
} from '@atlaskit/editor-common/analytics';
import {
	getParentOfTypeCount,
	getPositionAfterTopParentNodeOfType,
	isNestedTablesSupported,
} from '@atlaskit/editor-common/nesting';
import type { Command, EditorCommand } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType, safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
	addColumnAt as addColumnAtPMUtils,
	addRowAt,
	findTable,
	selectedRect,
} from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { PluginInjectionAPI } from '../../types';
import { updateRowOrColumnMovedTransform } from '../analytics/commands';
import { META_KEYS } from '../table-analytics';
import { rescaleColumns } from '../transforms/column-width';
import { createTableWithWidth } from '../utils/create';
import { getAllowAddColumnCustomStep } from '../utils/get-allow-add-column-custom-step';
import { checkIfHeaderRowEnabled } from '../utils/nodes';
import { copyPreviousRow } from '../utils/row-controls';

type InsertTableWithNestingSupportCommand = (
	options: {
		createTableProps?: {
			colsCount?: number;
			rowsCount?: number;
		};
		isChromelessEditor?: boolean;
		isCommentEditor?: boolean;
		isFullWidthModeEnabled?: boolean;
		isMaxWidthModeEnabled?: boolean;
		isTableAlignmentEnabled?: boolean;
		isTableResizingEnabled?: boolean;
		isTableScalingEnabled?: boolean;
	},
	api: PluginInjectionAPI | undefined | null,
	analyticsPayload?: AnalyticsEventPayload,
) => EditorCommand;

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
				updatedTr = addColumnAtPMUtils(column)(updatedTr);
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
			const rect = selectedRect(state);
			dispatch(
				addColumnAt(
					api,
					isTableScalingEnabled,
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
			const rect = selectedRect(state);
			dispatch(
				addColumnAt(
					api,
					isTableScalingEnabled,
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
		isTableFixedColumnWidthsOptionEnabled?: boolean,
		shouldUseIncreasedScalingPercent?: boolean,
		isCommentEditor?: boolean,
	) =>
	(column: number): Command =>
	(state, dispatch, view) => {
		const tr = addColumnAt(
			api,
			isTableScalingEnabled,
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
	(row: number, moveCursorToTheNewRow: boolean): Command =>
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
			: addRowAt(row, undefined)(state.tr);

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

/**
 * @private
 * @deprecated This function is deprecated - please use insertTableWithNestingSupport instead.
 * (To be removed with feature gate: `platform_editor_use_nested_table_pm_nodes`)
 */
export const createTable =
	(
		isTableScalingEnabled?: boolean,
		isTableAlignmentEnabled?: boolean,
		isFullWidthModeEnabled?: boolean,
		isMaxWidthModeEnabled?: boolean,
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
			isMaxWidthModeEnabled,
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

/**
 * @private
 * @deprecated This function is deprecated - please use insertTableWithNestingSupport instead.
 * (To be removed with feature gate: `platform_editor_use_nested_table_pm_nodes`)
 */
export const insertTableWithSize =
	(
		isFullWidthModeEnabled?: boolean,
		isMaxWidthModeEnabled?: boolean,
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
				isMaxWidthModeEnabled,
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

/**
 * Unified command to insert a new table into the editor.
 *
 * @param {object} options - Configuration options for table insertion.
 * @param {boolean} [options.isTableScalingEnabled=false] - Flag to enable table scaling.
 * @param {boolean} [options.isTableAlignmentEnabled=false] - Flag to enable table alignment.
 * @param {boolean} [options.isFullWidthModeEnabled=false] - Flag to enable full-width mode for the table.
 * @param {boolean} [options.isCommentEditor=false] - Flag to indicate if the editor is in comment mode.
 * @param {boolean} [options.isChromelessEditor=false] - Flag to indicate if the editor is chromeless.
 * @param {boolean} [options.isTableResizingEnabled=false] - Flag to enable table resizing.
 * @param {object} [options.createTableProps={}] - Additional properties for table creation, including table size.
 * @param {object} api - PluginInjectinoApi object for content insertion commands.
 * @param {object} analyticsPayload - Payload for analytics tracking.
 *
 * @returns {Function} A function that takes a transaction and inserts a table.
 */
export const insertTableWithNestingSupport: InsertTableWithNestingSupportCommand =
	(
		{
			isTableScalingEnabled = false,
			isTableAlignmentEnabled = false,
			isFullWidthModeEnabled = false,
			isMaxWidthModeEnabled = false,
			isCommentEditor = false,
			isChromelessEditor = false,
			isTableResizingEnabled = false,
			createTableProps = {},
		},
		api,
		analyticsPayload,
	) =>
	({ tr }) => {
		const { schema } = tr.doc.type;

		// If the cursor is inside a table
		let insertAt: Selection | undefined;
		let isNestedTable = false;
		if (
			hasParentNodeOfType(schema.nodes.table)(tr.selection) &&
			isNestedTablesSupported(schema) &&
			fg('platform_editor_use_nested_table_pm_nodes')
		) {
			// If the experiment is disabled, or we're trying to nest deeper than one level, we insert the table after the top table
			if (
				editorExperiment('nested-tables-in-tables', false, { exposure: true }) ||
				getParentOfTypeCount(schema.nodes.table)(tr.selection.$from) > 1
			) {
				const positionAfterTopTable = getPositionAfterTopParentNodeOfType(schema.nodes.table)(
					tr.selection.$from,
				);
				if (!positionAfterTopTable) {
					return tr;
				}
				insertAt = TextSelection.create(tr.doc, positionAfterTopTable);
			} else {
				// Table can be nested in parent table
				isNestedTable = true;
			}
		}

		const node = createTableWithWidth({
			isTableScalingEnabled,
			isTableAlignmentEnabled,
			isFullWidthModeEnabled,
			isMaxWidthModeEnabled,
			isCommentEditor,
			isChromelessEditor,
			isTableResizingEnabled,
			isNestedTable,
			createTableProps,
		})(schema);

		api?.contentInsertion?.commands?.insert({
			node,
			options: {
				selectNodeInserted: false,
				analyticsPayload: analyticsPayload
					? {
							...analyticsPayload,
							attributes: {
								...analyticsPayload.attributes,
								localId: node.attrs.localId,
							},
						}
					: undefined,
				insertAt,
			},
		})({ tr });

		return tr;
	};
