import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { getActiveColor } from '../editor-commands/color';
import { getDisabledState } from '../editor-commands/disabled';
import type { HighlightPlugin } from '../highlightPluginType';

export const highlightPluginKey = new PluginKey<HighlightPluginState>('highlight');

export type HighlightPluginState = {
	activeColor: string | null; // Hex value color, lowercase
	disabled: boolean;
	isPaletteOpen: boolean;
};

export enum HighlightPluginAction {
	CHANGE_COLOR,
	SET_PALETTE,
}

export const createPlugin = ({
	api,
}: {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
}) => {
	return new SafePlugin({
		key: highlightPluginKey,
		state: {
			init: (_: unknown, editorState: EditorState): HighlightPluginState => ({
				activeColor: null,
				disabled: getDisabledState(editorState),
				isPaletteOpen: false,
			}),
			apply: (
				tr: ReadonlyTransaction,
				pluginState: HighlightPluginState,
				_oldState: EditorState,
				newState: EditorState,
			): HighlightPluginState => {
				const action = tr.getMeta(highlightPluginKey)?.type;

				switch (action) {
					case HighlightPluginAction.CHANGE_COLOR:
						const { color } = tr.getMeta(highlightPluginKey);

						return {
							...pluginState,
							activeColor: color,
						};

					case HighlightPluginAction.SET_PALETTE:
						const { isPaletteOpen } = tr.getMeta(highlightPluginKey);

						return {
							...pluginState,
							isPaletteOpen,
						};

					default:
						return {
							...pluginState,
							activeColor: getActiveColor(tr),
							disabled: getDisabledState(newState),
						};
				}
			},
		},
	});
};
