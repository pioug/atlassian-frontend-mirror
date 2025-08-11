import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { LimitedModePlugin } from './limitedModePluginType';
import { createPlugin, limitedModePluginKey } from './pm-plugins/main';

export const limitedModePlugin: LimitedModePlugin = () => {
	return {
		name: 'limitedMode',
		pmPlugins() {
			return [
				{
					name: 'limitedModePlugin',
					plugin: createPlugin,
				},
			];
		},
		getSharedState(editorState: EditorState | undefined) {
			if (editorState) {
				return {
					get enabled() {
						return limitedModePluginKey.getState(editorState).documentSizeBreachesThreshold;
					},
					limitedModePluginKey,
				};
			}
			return { enabled: false, limitedModePluginKey };
		},
	};
};
