import type { EditorPluginNativeEmbedsPlugin } from './nativeEmbedsPluginType';
import { getToolbarConfig } from './pm-plugins/ui/floating-toolbar';

export const nativeEmbedsPlugin: EditorPluginNativeEmbedsPlugin = ({ api, config }) => ({
	name: 'editorPluginNativeEmbeds',
	pluginsOptions: {
		floatingToolbar: getToolbarConfig({ api, handlers: config?.handlers }),
	},
});
