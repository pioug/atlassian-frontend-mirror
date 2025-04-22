import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { EditorState, Plugin, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { PmHistoryPluginState } from '../pm-plugins/pm-history-types';

/**
 * @private
 * @deprecated
 * Do not use this directly. Delete when we cleanup `platform_editor_improve_history_state_performance`
 */
export const getPmHistoryPlugin = (state: EditorState): Plugin | undefined => {
	return state.plugins.find(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(plugin) => (plugin as any).key === pmHistoryPluginKey,
	);
};

// Internal prosemirror history plugin does not export its plugin key.
// Previously we searched through all the plugins to find the history plugin
// but it's faster to look up the plugin directly via `getState`.
const fakePluginKey = {
	key: pmHistoryPluginKey,
	getState: (state: EditorState) => {
		// The plugin key is used to index state
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (state as any)[pmHistoryPluginKey];
	},
	get(state: EditorState) {
		return state.plugins.find(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(plugin) => (plugin as any).key === pmHistoryPluginKey,
		);
	},
} as PluginKey;

export const getPmHistoryPluginState = (state: EditorState): PmHistoryPluginState | undefined => {
	if (fg('platform_editor_improve_history_state_performance')) {
		return fakePluginKey.getState(state);
	}
	const pmHistoryPlugin = getPmHistoryPlugin(state);
	if (!pmHistoryPlugin) {
		return;
	}
	return pmHistoryPlugin.getState(state);
};
