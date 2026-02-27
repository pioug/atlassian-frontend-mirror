import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { createPlugin, showDiffPluginKey } from './pm-plugins/main';
import type { ShowDiffPlugin, PMDiffParams } from './showDiffPluginType';

export const showDiffPlugin: ShowDiffPlugin = ({ api: _api, config }) => ({
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
			scrollToNext: ({ tr }) => {
				return tr.setMeta(showDiffPluginKey, { action: 'SCROLL_TO_NEXT' });
			},
			scrollToPrevious: ({ tr }) => {
				return tr.setMeta(showDiffPluginKey, { action: 'SCROLL_TO_PREVIOUS' });
			},
		},
	pmPlugins() {
		return [
			{
				name: 'showDiffPlugin',
				plugin: ({ getIntl }) => createPlugin(config, getIntl),
			},
		];
	},
		getSharedState: (editorState: EditorState | undefined) => {
			if (!editorState) {
				return {
					isDisplayingChanges: false,
					activeIndex: undefined,
				};
			}
			const pluginState = showDiffPluginKey.getState(editorState);
			const decorationCount = pluginState?.decorations?.find() || [];
			return {
				isDisplayingChanges: decorationCount.length > 0,
				activeIndex: pluginState?.activeIndex,
				numberOfChanges: decorationCount.length,
			};
		},
});
