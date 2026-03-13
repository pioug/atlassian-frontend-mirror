import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { ExtensionAction, ExtensionState } from '../extensionPluginType';

import { pluginKey } from './plugin-key';
import reducer from './reducer';

const factory = pluginFactory(pluginKey, reducer, {
	mapping(tr, state) {
		const { positions: previousPositions } = state as ExtensionState;
		if (!previousPositions) {
			return state;
		}

		const positions = { ...previousPositions };
		// eslint-disable-next-line guard-for-in
		for (const key in positions) {
			positions[key] = tr.mapping.map(positions[key]);
		}

		return {
			...state,
			positions,
		};
	},
});

export const createPluginState: (
	dispatch: Dispatch,
	initialState: ExtensionState | ((state: EditorState) => ExtensionState),
) => SafeStateField<ExtensionState> = factory.createPluginState;
export const createCommand: <A = ExtensionAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = factory.createCommand;
export const getPluginState: (state: EditorState) => ExtensionState = factory.getPluginState;
