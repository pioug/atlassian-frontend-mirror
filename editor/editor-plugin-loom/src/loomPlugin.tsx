import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LoomPlugin } from './loomPluginType';
import { insertLoom, recordVideo, setupLoom } from './pm-plugins/commands';
import { createPlugin, loomPluginKey } from './pm-plugins/main';
import { loomPrimaryToolbarComponent } from './ui/PrimaryToolbarButton';
import { getQuickInsertItem } from './ui/quickInsert';
import { getToolbarComponents } from './ui/toolbar-components';

export const loomPlugin: LoomPlugin = ({ config, api }) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const isNewToolbarEnabled =
		editorExperiment('platform_editor_toolbar_aifc', true, { exposure: true }) &&
		expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true);

	// Workaround since we want to insert a loom via the `hyperlink` plugin for now.
	// The hyperlink plugin (and the card plugin) are deeply tied into using the Prosemirror Command
	// Ideally one day we refactor those and we can remove this.
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
	const primaryToolbarComponent: ToolbarUIComponentFactory = loomPrimaryToolbarComponent(
		config,
		api,
	);
	if (isNewToolbarEnabled) {
		api?.toolbar?.actions.registerComponents(getToolbarComponents(config, api));
	} else {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'loom',
			component: primaryToolbarComponent,
		});
	}

	return {
		name: 'loom',

		actions: {
			recordVideo,
			insertLoom: (video, positionType) =>
				insertLoom(editorViewRef.current, api, video, positionType),
			initLoom: ({ loomProvider }) => {
				return setupLoom(loomProvider, api, editorViewRef.current, true);
			},
		},

		pmPlugins: () => [
			{
				name: 'loom',
				plugin: () => createPlugin({ config, api }),
			},
			{
				name: 'loomViewRefWorkaround',
				plugin: () => {
					return new SafePlugin({
						view: (editorView: EditorView) => {
							// Do not cleanup the editorViewRef on destroy
							// because some functions may point to a stale
							// reference and this means we will return null.
							// EditorView is assumed to be stable so we do not need to
							// cleanup.
							// See: #hot-106316
							editorViewRef.current = editorView;
							return {};
						},
					});
				},
			},
		],

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}
			return loomPluginKey.getState(editorState);
		},

		pluginsOptions: {
			// Enable inserting Loom recordings through the slash command
			quickInsert: (intl) => {
				if (config.loomProvider) {
					return getQuickInsertItem(editorAnalyticsAPI)(intl);
				}
				return [];
			},
		},

		// Enable inserting Loom recordings through main toolbar
		primaryToolbarComponent:
			!api?.primaryToolbar && !isNewToolbarEnabled ? primaryToolbarComponent : undefined,
	};
};
