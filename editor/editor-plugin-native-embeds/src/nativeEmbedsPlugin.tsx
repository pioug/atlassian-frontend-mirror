import type { EditorPluginNativeEmbedsPlugin } from './nativeEmbedsPluginType';
import { createPlugin } from './pm-plugins/plugin-state';
import { getToolbarConfig } from './pm-plugins/ui/floating-toolbar';

export const nativeEmbedsPlugin: EditorPluginNativeEmbedsPlugin = ({ api, config }) => ({
	name: 'editorPluginNativeEmbeds',
	pmPlugins() {
		return [
			{
				name: 'nativeEmbedsPluginState',
				plugin: createPlugin,
			},
		];
	},
	pluginsOptions: {
		floatingToolbar: getToolbarConfig({
			api,
			getEditorToolbarActions: config?.getEditorToolbarActions,
			actionHandlers: config?.actionHandlers,
			handlers: config?.handlers,
			linkPickerOptions: config?.linkPickerOptions,
			lpLinkPicker: config?.lpLinkPicker,
		}),
	},
});
