import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { REMOVE_HIGHLIGHT_COLOR } from '@atlaskit/editor-common/ui-color';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type { HighlightPlugin } from './plugin';
import { getActiveColor } from './utils/color';
import { getDisabledState } from './utils/disabled';

export const highlightPluginKey = new PluginKey<HighlightPluginState>('highlight');

export type HighlightPluginState = {
	activeColor: string | null; // Hex value color, lowercase
	disabled: boolean;
};

export enum HighlightPluginAction {
	CHANGE_COLOR,
}

export const createPlugin = ({
	api,
}: {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
}) => {
	return new SafePlugin({
		key: highlightPluginKey,
		state: {
			init: (): HighlightPluginState => ({
				activeColor: REMOVE_HIGHLIGHT_COLOR,
				disabled: true,
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
