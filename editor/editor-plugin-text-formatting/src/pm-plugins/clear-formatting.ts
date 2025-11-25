import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { checkFormattingIsPresent } from '../editor-commands/utils';

export interface ClearFormattingState {
	formattingIsPresent?: boolean;
}

export const pluginKey = new PluginKey<ClearFormattingState>('clearFormattingPlugin');

export const plugin = (dispatch: Dispatch) =>
	new SafePlugin({
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init(_config, state: EditorState) {
				return { formattingIsPresent: checkFormattingIsPresent(state) };
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply(_tr, pluginState: ClearFormattingState, _oldState, newState) {
				const formattingIsPresent = checkFormattingIsPresent(newState);
				if (formattingIsPresent !== pluginState.formattingIsPresent) {
					dispatch(pluginKey, { formattingIsPresent });
					return { formattingIsPresent };
				}
				return pluginState;
			},
		},
		key: pluginKey,
	});
