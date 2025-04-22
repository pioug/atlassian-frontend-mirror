import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { setCurrentUserIntent } from './editor-commands';
import { createPlugin, userIntentPluginKey } from './pm-plugins/main';
import type { UserIntentPlugin } from './userIntentPluginType';

export const userIntentPlugin: UserIntentPlugin = () => ({
	name: 'userIntent',
	pmPlugins() {
		return [
			{
				name: 'userIntentPlugin',
				plugin: createPlugin,
			},
		];
	},

	getSharedState: (editorState?: EditorState) => {
		if (!editorState) {
			return;
		}

		const pluginState = userIntentPluginKey.getState(editorState);

		if (!pluginState) {
			return;
		}

		return {
			currentUserIntent: pluginState.currentUserIntent,
		};
	},

	commands: {
		setCurrentUserIntent,
	},
});
