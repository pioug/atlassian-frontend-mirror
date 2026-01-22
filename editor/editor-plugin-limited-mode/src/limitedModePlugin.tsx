import { getNodeIdProvider } from '@atlaskit/editor-common/node-anchor';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { LimitedModePlugin } from './limitedModePluginType';
import { createPlugin, limitedModePluginKey } from './pm-plugins/main';

export const limitedModePlugin: LimitedModePlugin = ({ api }) => {
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
						return (
							limitedModePluginKey.getState(editorState)?.documentSizeBreachesThreshold ?? false
						);
					},
					limitedModePluginKey,
				};
			}
			return { enabled: false, limitedModePluginKey };
		},
		usePluginHook: ({ editorView }) => {
			usePluginStateEffect(api, ['limitedMode'], ({ limitedModeState }) => {

				if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
					if (fg('platform_editor_native_anchor_patch_2')) {
						const isEnabled = limitedModeState?.enabled ?? false;

						const nodeIdProvider = getNodeIdProvider(editorView);
						// When limited mode is enabled first time,
						// We need to remove all existing data-node-anchor attributes
						// And nodeIdProvider to limited mode to prevent adding data-node-anchor on new nodes

						if (isEnabled && nodeIdProvider && !nodeIdProvider.isLimitedMode()) {
							nodeIdProvider.setLimitedMode();
						}
					}
				}
			});
		},
	};
};
