import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { SelectionPluginState } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type {
	EditorState,
	ReadonlyTransaction,
	SafeStateField,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { selectionPluginKey } from '../types';

import type { SelectionAction } from './actions';
import { reducer } from './reducer';
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

const dest = pluginFactory(selectionPluginKey, reducer, {
	onDocChanged: handleDocChanged,
	onSelectionChanged: handleSelectionChanged,
});
export const createCommand: <A = SelectionAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => SelectionPluginState = dest.getPluginState;
export const createPluginState: (
	dispatch: Dispatch,
	initialState: SelectionPluginState | ((state: EditorState) => SelectionPluginState),
) => SafeStateField<SelectionPluginState> = dest.createPluginState;
