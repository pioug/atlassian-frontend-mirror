import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getScrollableDecorations } from './pm-plugins/getScrollableDecorations';
import { createPlugin, showDiffPluginKey } from './pm-plugins/main';
import type { ShowDiffPlugin, PMDiffParams } from './showDiffPluginType';

export const showDiffPlugin: ShowDiffPlugin = ({ api, config }) => ({
	name: 'showDiff',
	commands: {
		showDiff:
			(params?: PMDiffParams) =>
			({ tr }) => {
				if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
					api?.userIntent?.commands.setCurrentUserIntent('viewingDiff')({ tr });
				}
				return tr.setMeta(showDiffPluginKey, { ...params, action: 'SHOW_DIFF' });
			},
		hideDiff: ({ tr }) => {
			if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
				api?.userIntent?.commands.setCurrentUserIntent('default')({ tr });
			}
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
				plugin: ({ getIntl }) => createPlugin(config, getIntl, api),
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
		const decorationCount = getScrollableDecorations(pluginState?.decorations, editorState.doc);
		return {
			isDisplayingChanges: decorationCount.length > 0,
			activeIndex: pluginState?.activeIndex,
			numberOfChanges: decorationCount.length,
		};
	},
});
