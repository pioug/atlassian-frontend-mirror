import { type FocusPlugin } from './focusPluginType';
import { createPlugin, key } from './pm-plugins/main';

/**
 * Focus plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const focusPlugin: FocusPlugin = ({ api }) => {
	return {
		name: 'focus',

		getSharedState(editorState) {
			if (!editorState) {
				return {
					hasFocus: false,
				};
			}

			return {
				hasFocus: Boolean(key.getState(editorState)?.hasFocus),
			};
		},

		pmPlugins() {
			return [
				{
					name: 'focusHandlerPlugin',
					plugin: createPlugin,
				},
			];
		},
	};
};
