import type { EditorPluginNativeEmbedsPlugin } from './nativeEmbedsPluginType';
import { getToolbarConfig } from './pm-plugins/ui/floating-toolbar';

export const nativeEmbedsPlugin: EditorPluginNativeEmbedsPlugin = ({ api, config }) => ({
	name: 'editorPluginNativeEmbeds',
	pluginsOptions: {
		floatingToolbar: getToolbarConfig({
			api,
			getEditorToolbarActions: config?.getEditorToolbarActions,
			actionHandlers: config?.actionHandlers,
			handlers: config?.handlers,
		}),
	},
});
