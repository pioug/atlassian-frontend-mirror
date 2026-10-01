import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { useWidthObserver } from './ui/hooks/useWidthObserver';
import type { WidthPlugin } from './widthPluginType';

/**
 * Width plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const widthPlugin: WidthPlugin = () => {
	return {
		name: 'width',

		pmPlugins: () => [
			{
				name: 'width',
				plugin: ({ dispatch }) => createPlugin(dispatch),
			},
		],

		getSharedState: (editorState) => {
			if (!editorState) {
				return undefined;
			}

			return pluginKey.getState(editorState);
		},

		// Dispatches between the legacy hook and its replacement while
		// `platform_editor_reduce_forced_layout` runs. On cleanup, point this at the surviving
		// hook and delete `useWidthObserver`.
		usePluginHook: useWidthObserver,
	};
};
