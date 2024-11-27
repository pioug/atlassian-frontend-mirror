import type { CompositionPlugin } from './compositionPluginType';
import createPlugin from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';

/**
 * Composition plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const compositionPlugin: CompositionPlugin = () => {
	return {
		name: 'composition',
		getSharedState(editorState) {
			if (!editorState) {
				return {
					isComposing: false,
				};
			}
			return {
				isComposing: !!pluginKey.getState(editorState)?.isComposing,
			};
		},
		pmPlugins() {
			return [
				{
					name: 'composition',
					plugin: () => createPlugin(),
				},
			];
		},
	};
};
