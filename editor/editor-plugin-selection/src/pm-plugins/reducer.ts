import type { SelectionPluginState } from '../types';

import type { SelectionAction } from './actions';
import { SelectionActionTypes } from './actions';

export function reducer(
	pluginState: SelectionPluginState,
	action: SelectionAction,
): SelectionPluginState {
	switch (action.type) {
		case SelectionActionTypes.SET_DECORATIONS:
			return {
				...pluginState,
				decorationSet: action.decorationSet,
				selection: action.selection,
			};
		case SelectionActionTypes.SET_RELATIVE_SELECTION:
			return {
				...pluginState,
				selectionRelativeToNode: action.selectionRelativeToNode,
			};
		default:
			return pluginState;
	}
}
