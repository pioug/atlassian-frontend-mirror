import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { isAlignable } from '../commands';
import { getActiveAlignment } from '../utils';

import type { AlignmentPluginState } from './types';

export function createInitialPluginState(
	editorState: EditorState,
	pluginConfig: AlignmentPluginState,
): AlignmentPluginState {
	return {
		align: getActiveAlignment(editorState) || pluginConfig.align,
		isEnabled: true,
	};
}

export const pluginKey = new PluginKey<AlignmentPluginState>('alignmentPlugin');

export function createPlugin(dispatch: Dispatch, pluginConfig: AlignmentPluginState) {
	return new SafePlugin<AlignmentPluginState>({
		key: pluginKey,
		state: {
			init(_: unknown, editorState: EditorState) {
				return createInitialPluginState(editorState, pluginConfig);
			},
			apply(
				_tr: ReadonlyTransaction,
				state: AlignmentPluginState,
				_prevState: EditorState,
				nextState: EditorState,
			) {
				const nextPluginState = getActiveAlignment(nextState)!;
				const isEnabled = isAlignable(nextPluginState)(nextState);
				const newState = {
					...state,
					align: nextPluginState,
					isEnabled,
				};
				if (nextPluginState !== state.align || isEnabled !== state.isEnabled) {
					dispatch(pluginKey, newState);
				}
				return newState;
			},
		},
	});
}
