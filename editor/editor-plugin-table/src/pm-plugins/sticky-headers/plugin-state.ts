import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from './plugin-key';
import type { StickyPluginAction, StickyPluginState } from './types';

const reducer = (pluginState: StickyPluginState, action: StickyPluginAction): StickyPluginState => {
	if (action.name === 'UPDATE') {
		let updated = false;
		const updatedState = pluginState.map((oldTableState) => {
			const replace = oldTableState.pos === action.state.pos;

			if (replace) {
				updated = true;
			}

			return replace ? action.state : oldTableState;
		});

		if (!updated) {
			// new, add it
			updatedState.push(action.state);
		}

		return updatedState;
	} else if (action.name === 'REMOVE') {
		return pluginState.filter((rowState) => rowState.pos !== action.pos);
	}

	return pluginState;
};

const dest = pluginFactory(pluginKey, reducer, {
	mapping: (tr, pluginState) => {
		if (tr.docChanged) {
			return pluginState
				.map((rowInfo) => {
					const remapped = tr.mapping.mapResult(rowInfo.pos);
					return remapped
						? {
								...rowInfo,
								pos: remapped.pos,
							}
						: undefined;
				})
				.filter((f) => f !== undefined) as StickyPluginState;
		}

		return pluginState;
	},
});
const createPluginState: (
	dispatch: Dispatch,
	initialState: StickyPluginState | ((state: EditorState) => StickyPluginState),
) => SafeStateField<StickyPluginState> = dest.createPluginState;
const createCommand: <A = StickyPluginAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;

export { createPluginState, createCommand };
