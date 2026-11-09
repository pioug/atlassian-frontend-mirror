import type {
	InternalNumberedHeadingsPlugin,
	NumberedHeadingsPlugin,
} from './numberedHeadingsPluginType';
import { createNumberedHeadingsKeymapPlugin } from './pm-plugins/keymap';
import { createNumberedHeadingsPlugin, numberedHeadingsPluginKey } from './pm-plugins/main';
import { getToolbarComponents } from './ui/toolbar-components';

const internalNumberedHeadingsPlugin: InternalNumberedHeadingsPlugin = ({ api }) => {
	api?.toolbar?.actions.registerComponents(getToolbarComponents(api));

	return {
		name: 'numberedHeadings',

		pmPlugins() {
			return [
				{
					name: 'numberedHeadings',
					plugin: () => createNumberedHeadingsPlugin(api),
				},
				{
					// Handles keydown directly, so it runs before the panel, table and block-type keymaps.
					name: 'numberedHeadingsKeymap',
					plugin: () => createNumberedHeadingsKeymapPlugin(),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return { enabled: Boolean(numberedHeadingsPluginKey.getState(editorState)?.enabled) };
		},
	};
};

// Keep the runtime shared state available to the toolbar without exposing it to consumers.
export const numberedHeadingsPlugin: NumberedHeadingsPlugin =
	internalNumberedHeadingsPlugin as NumberedHeadingsPlugin;
