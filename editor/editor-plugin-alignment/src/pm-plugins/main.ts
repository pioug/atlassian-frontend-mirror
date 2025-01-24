import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { isAlignable } from '../editor-commands';

import type { AlignmentPluginState } from './types';
import { getActiveAlignment } from './utils';

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
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
