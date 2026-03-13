import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export type ScrollGutterPluginState = {
	keyboardHeight: number;
};

export const scrollGutterPluginKey: PluginKey<ScrollGutterPluginState> =
	new PluginKey<ScrollGutterPluginState>('scrollGutter');

export const getScrollGutterPluginState = (
	state?: EditorState,
): ScrollGutterPluginState | undefined => {
	if (state) {
		return scrollGutterPluginKey.getState(state) as ScrollGutterPluginState | undefined;
	}
};
