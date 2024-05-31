//#region Imports

import type { TableLayout } from '@atlaskit/adf-schema';
import { TABLE_OVERFLOW_CHANGE_TRIGGER } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findTable, toggleHeader } from '@atlaskit/editor-tables/utils';

import { createCommand } from '../pm-plugins/plugin-factory';
import { META_KEYS } from '../pm-plugins/table-analytics';
//#endregion

// #region Utils
/**
 * Table layout toggle logic
 * default -> wide -> full-width -> default
 */
export const getNextLayout = (currentLayout: TableLayout) => {
	switch (currentLayout) {
		case 'default':
			return 'wide';
		case 'wide':
			return 'full-width';
		case 'full-width':
			return 'default';
		default:
			return 'default';
	}
};
// #endregion

// #region Actions
export const toggleHeaderRow: Command = (state, dispatch): boolean =>
	toggleHeader('row')(state, (tr) =>
		createCommand({ type: 'TOGGLE_HEADER_ROW' }, () => tr.setMeta('scrollIntoView', false))(
			state,
			dispatch,
		),
	);

export const toggleHeaderColumn: Command = (state, dispatch): boolean =>
	toggleHeader('column')(state, (tr) =>
		createCommand({ type: 'TOGGLE_HEADER_COLUMN' }, () => tr.setMeta('scrollIntoView', false))(
			state,
			dispatch,
		),
	);

export const toggleNumberColumn: Command = (state, dispatch) => {
	const { tr } = state;
	const { node, pos } = findTable(state.selection)!;
	const isNumberedColumnEnabled = node.attrs.isNumberColumnEnabled;

	tr.setNodeMarkup(pos, state.schema.nodes.table, {
		...node.attrs,
		isNumberColumnEnabled: !isNumberedColumnEnabled,
	});
	tr.setMeta('scrollIntoView', false);

	const tableOverflowChangeTriggerName = isNumberedColumnEnabled
		? TABLE_OVERFLOW_CHANGE_TRIGGER.DISABLED_NUMBERED_COLUMN
		: TABLE_OVERFLOW_CHANGE_TRIGGER.ENABLED_NUMBERED_COLUMN;
	tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
		name: tableOverflowChangeTriggerName,
	});

	if (dispatch) {
		dispatch(tr);
	}
	return true;
};

export const toggleTableLayout: Command = (state, dispatch): boolean => {
	const table = findTable(state.selection);
	if (!table) {
		return false;
	}
	const layout = getNextLayout(table.node.attrs.layout);

	return createCommand(
		{
			type: 'SET_TABLE_LAYOUT',
			data: {
				layout,
			},
		},
		(tr: Transaction) => {
			tr.setNodeMarkup(table.pos, state.schema.nodes.table, {
				...table.node.attrs,
				layout,
			});
			tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
				name: TABLE_OVERFLOW_CHANGE_TRIGGER.RESIZED,
			});
			return tr.setMeta('scrollIntoView', false);
		},
	)(state, dispatch);
};

export const toggleContextualMenu = () =>
	createCommand(
		{
			type: 'TOGGLE_CONTEXTUAL_MENU',
		},
		(tr) => tr.setMeta('addToHistory', false),
	);
// #endregion
