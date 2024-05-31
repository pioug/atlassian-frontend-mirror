import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { reducer } from './reducer';
import type { SelectionPluginState } from './types';
import { selectionPluginKey } from './types';
import { getDecorations, isSelectableContainerNode } from './utils';

const handleDocChanged = (
	tr: ReadonlyTransaction,
	pluginState: SelectionPluginState,
): SelectionPluginState => {
	// in some collab edge cases mapping decorations could throw an error
	try {
		if (
			pluginState.decorationSet.find().length === 0 &&
			(!tr.selectionSet || getDecorations(tr).find().length === 0)
		) {
			return pluginState;
		}

		const decorationSet = pluginState.decorationSet.map(tr.mapping, tr.doc);

		return {
			...pluginState,
			decorationSet,
		};
	} catch (error) {
		return {
			...pluginState,
			decorationSet: DecorationSet.empty,
		};
	}
};

const handleSelectionChanged = (
	tr: ReadonlyTransaction,
	pluginState: SelectionPluginState,
): SelectionPluginState => {
	// Reset relative selection pos when user clicks to select a node
	if (
		((tr.selection instanceof NodeSelection && isSelectableContainerNode(tr.selection.node)) ||
			tr.selection instanceof CellSelection) &&
		!tr.getMeta(selectionPluginKey)
	) {
		return {
			...pluginState,
			selectionRelativeToNode: undefined,
		};
	}
	return pluginState;
};

export const { createCommand, getPluginState, createPluginState } = pluginFactory(
	selectionPluginKey,
	reducer,
	{
		onDocChanged: handleDocChanged,
		onSelectionChanged: handleSelectionChanged,
	},
);
