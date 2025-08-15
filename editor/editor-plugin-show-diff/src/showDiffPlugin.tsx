import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { createPlugin, showDiffPluginKey } from './pm-plugins/main';
import type { ShowDiffPlugin, PMDiffParams } from './showDiffPluginType';

export const showDiffPlugin: ShowDiffPlugin = ({ api, config }) => ({
	name: 'showDiff',
	commands: {
		showDiff:
			(params?: PMDiffParams) =>
			({ tr }) => {
				return tr.setMeta(showDiffPluginKey, { ...params, action: 'SHOW_DIFF' });
			},
		hideDiff: ({ tr }) => {
			return tr.setMeta(showDiffPluginKey, { steps: [], action: 'HIDE_DIFF' });
		},
	},
	pmPlugins() {
		return [
			{
				name: 'showDiffPlugin',
				plugin: () => createPlugin(config),
			},
		];
	},
	getSharedState: (editorState: EditorState | undefined) => {
		if (!editorState) {
			return {
				isDisplayingChanges: false,
			};
		}
		const pluginState = showDiffPluginKey.getState(editorState);
		const decorationCount = pluginState?.decorations?.find() || [];
		return {
			isDisplayingChanges: decorationCount.length > 0,
		};
	},
});
