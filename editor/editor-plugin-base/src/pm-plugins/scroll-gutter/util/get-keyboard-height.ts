import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { getScrollGutterPluginState } from '../plugin-key';

export const getKeyboardHeight = (state?: EditorState) => {
	if (state) {
		const scrollGutterPluginState = getScrollGutterPluginState(state);
		return scrollGutterPluginState ? scrollGutterPluginState.keyboardHeight : undefined;
	}
};
