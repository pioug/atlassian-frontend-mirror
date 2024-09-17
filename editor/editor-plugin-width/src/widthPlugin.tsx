import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { useResizeWidthObserver } from './ui/hooks/useResizeWidthObserver';
import { type WidthPlugin } from './widthPluginType';

/**
 * Width plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const widthPlugin: WidthPlugin = () => ({
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

	usePluginHook({ editorView, containerElement }) {
		return useResizeWidthObserver({ editorView, containerElement });
	},
});
