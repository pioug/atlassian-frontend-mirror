import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from './plugin-key';

export function createPlugin(dispatch: Function, imageEnabled: boolean) {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init() {
				return { isVisible: false, imageEnabled };
			},
			apply(tr: ReadonlyTransaction, _value: unknown, state: EditorState) {
				const isVisible = tr.getMeta(pluginKey);
				const currentState = pluginKey.getState(state);
				if (isVisible !== undefined && isVisible !== currentState.isVisible) {
					const newState = { ...currentState, isVisible };
					dispatch(pluginKey, newState);
					return newState;
				}
				return currentState;
			},
		},
	});
}
