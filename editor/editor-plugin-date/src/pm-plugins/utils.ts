import type { ReadonlyTransaction, Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { DatePluginMeta, DatePluginState } from './types';

export function reducer(pluginState: DatePluginState, meta: DatePluginMeta): DatePluginState {
	// If the same nodeview is clicked twice, calendar should close
	if (meta.showDatePickerAt === pluginState.showDatePickerAt) {
		return { ...pluginState, showDatePickerAt: null };
	}

	const { showDatePickerAt, isNew } = pluginState;
	const { showDatePickerAt: showDatePickerAtMeta } = meta;
	// If date picker position has changed, it is no longer new
	if (
		showDatePickerAt &&
		showDatePickerAtMeta &&
		showDatePickerAt !== showDatePickerAtMeta &&
		isNew
	) {
		return { ...pluginState, ...meta, isNew: false };
	}
	return { ...pluginState, ...meta };
}

export function mapping(tr: ReadonlyTransaction, pluginState: DatePluginState): DatePluginState {
	if (!pluginState.showDatePickerAt) {
		return pluginState;
	}

	const { pos, deleted } = tr.mapping.mapResult(pluginState.showDatePickerAt);
	return {
		showDatePickerAt: deleted ? null : pos,
		isNew: pluginState.isNew,
		isDateEmpty: pluginState.isDateEmpty,
		focusDateInput: pluginState.focusDateInput,
		isInitialised: pluginState.isInitialised,
	};
}

export function onSelectionChanged(
	tr: ReadonlyTransaction,
	pluginState: DatePluginState,
): DatePluginState {
	if (tr.docChanged && isDateNodeSelection(tr.selection)) {
		return {
			...pluginState,
			isQuickInsertAction: false,
			showDatePickerAt: tr.selection.from,
		};
	} else if (!isDateNodeSelection(tr.selection) && !pluginState.isQuickInsertAction) {
		if (pluginState.showDatePickerAt) {
			return {
				showDatePickerAt: null,
				isNew: false,
				isDateEmpty: false,
				focusDateInput: false,
				isInitialised: true,
			};
		}

		return pluginState;
	}

	return pluginState;
}

const isDateNodeSelection = (selection: Selection) => {
	if (selection instanceof NodeSelection) {
		const nodeTypeName = selection.node.type.name;
		return nodeTypeName === 'date';
	}
	return false;
};
