import type { DecorationsPlugin } from './decorationsPluginType';
import decorationPlugin, {
	decorationStateKey,
	hoverDecoration,
	removeDecoration,
} from './pm-plugins/main';

/**
 * Decorations plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const decorationsPlugin: DecorationsPlugin = () => ({
	name: 'decorations',

	pmPlugins() {
		return [{ name: 'decorationPlugin', plugin: () => decorationPlugin() }];
	},

	actions: {
		hoverDecoration,
		removeDecoration,
	},

	getSharedState(editorState) {
		if (!editorState) {
			return { decoration: undefined };
		}
		return decorationStateKey.getState(editorState);
	},
});
