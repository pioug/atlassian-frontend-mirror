import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	EditorState,
	PluginKey,
	Transaction,
	type SafeStateField,
} from '@atlaskit/editor-prosemirror/state';

import type { PastePluginAction } from '../editor-actions/actions';
import type { PastePluginState } from '../pastePluginType';

import { reducer } from './reducer';

export const pluginKey: PluginKey = new PluginKey('pastePlugin');

const dest = pluginFactory(pluginKey, reducer, {
	mapping: (tr, pluginState) => {
		if (tr.docChanged) {
			let atLeastOnePositionChanged = false;
			const positionsMappedThroughChanges = Object.entries(pluginState.pastedMacroPositions).reduce<
				Record<string, number>
			>((acc, [key, position]) => {
				const mappedPosition = tr.mapping.map(position);
				if (position !== mappedPosition) {
					atLeastOnePositionChanged = true;
				}
				acc[key] = tr.mapping.map(position);
				return acc;
			}, {});

			if (atLeastOnePositionChanged) {
				return {
					...pluginState,
					pastedMacroPositions: positionsMappedThroughChanges,
				};
			}
		}
		return pluginState;
	},
});
export const createPluginState: (
	dispatch: Dispatch,
	initialState: PastePluginState | ((state: EditorState) => PastePluginState),
) => SafeStateField<PastePluginState> = dest.createPluginState;
export const createCommand: <A = PastePluginAction>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = dest.createCommand;
export const getPluginState: (state: EditorState) => PastePluginState = dest.getPluginState;
