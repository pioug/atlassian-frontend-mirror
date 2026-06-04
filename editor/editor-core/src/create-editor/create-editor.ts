import type {
	EditorPlugin,
	NamedReactHookFactory,
	PluginsOptions,
} from '@atlaskit/editor-common/types';

import type { EditorConfig } from '../types/editor-config';

export function processPluginsList(plugins: EditorPlugin[]): EditorConfig {
	/**
	 * First pass to collect pluginsOptions
	 */
	const pluginsOptions = plugins.reduce<PluginsOptions>((acc, plugin) => {
		if (plugin.pluginsOptions) {
			Object.keys(plugin.pluginsOptions).forEach((pluginName) => {
				if (!acc[pluginName]) {
					acc[pluginName] = [];
				}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				acc[pluginName].push(plugin.pluginsOptions![pluginName]);
			});
		}

		return acc;
	}, {});

	/**
	 * Process plugins
	 */
	return plugins.reduce<EditorConfig>(
		(acc, plugin) => {
			if (plugin.pmPlugins) {
				acc.pmPlugins.push(
					...plugin.pmPlugins(plugin.name ? pluginsOptions[plugin.name] : undefined),
				);
			}

			if (plugin.nodes) {
				acc.nodes.push(...plugin.nodes());
			}

			if (plugin.marks) {
				acc.marks.push(...plugin.marks());
			}

			if (plugin.contentComponent) {
				acc.contentComponents.push(plugin.contentComponent);
			}

			if (plugin.usePluginHook) {
				// Wrap with .bind(null) so we can annotate the function with the
				// plugin name without mutating the plugin's original hook reference.
				// MountPluginHooks reads `pluginName` to derive a stable React key.
				const named: NamedReactHookFactory = plugin.usePluginHook.bind(null);
				named.pluginName = plugin.name;
				acc.pluginHooks.push(named);
			}

			if (plugin.primaryToolbarComponent) {
				acc.primaryToolbarComponents.push(plugin.primaryToolbarComponent);
			}

			if (plugin.secondaryToolbarComponent) {
				acc.secondaryToolbarComponents.push(plugin.secondaryToolbarComponent);
			}

			if (plugin.onEditorViewStateUpdated) {
				acc.onEditorViewStateUpdatedCallbacks.push({
					pluginName: plugin.name,
					callback: plugin.onEditorViewStateUpdated,
				});
			}

			return acc;
		},
		{
			nodes: [],
			marks: [],
			pmPlugins: [],
			contentComponents: [],
			pluginHooks: [],
			primaryToolbarComponents: [],
			secondaryToolbarComponents: [],
			onEditorViewStateUpdatedCallbacks: [],
		},
	);
}
