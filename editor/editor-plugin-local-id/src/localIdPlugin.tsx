import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { replaceNode, getNode } from './editor-actions';
import type { LocalIdPlugin, LocalIdSharedState } from './localIdPluginType';
import { createPlugin } from './pm-plugins/main';
import { createWatchmenPlugin, localIdWatchmenPluginKey } from './pm-plugins/watchmen';

export const localIdPlugin: LocalIdPlugin = ({ api }) => ({
	name: 'localId',
	actions: {
		replaceNode: replaceNode(api),
		getNode: getNode(api),
	},
	pmPlugins() {
		return [
			{
				name: 'localIdPlugin',
				plugin: () => createPlugin(api),
			},
			{
				name: 'localId-watchmen',
				plugin: () =>
					fg('platform_editor_ai_aifc_localid_error_reporting')
						? createWatchmenPlugin(api)
						: undefined,
			},
		];
	},
	getSharedState(editorState: EditorState | undefined): LocalIdSharedState | undefined {
		if (!editorState) {
			return undefined;
		}

		const watchmentPluginState = localIdWatchmenPluginKey.getState(editorState);
		return {
			localIdWatchmenEnabled: !!watchmentPluginState?.enabled,
			localIdStatus: new Map(watchmentPluginState?.localIdStatus),
		};
	},
});
