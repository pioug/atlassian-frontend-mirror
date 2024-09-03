import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

type ElementBrowserPmPluginState = {
	menuBrowserOpen: boolean;
};

/**
 * For insert menu in right rail experiment
 * - Clean up ticket ED-24801
 */
export const elementBrowserPmKey = new PluginKey<ElementBrowserPmPluginState>(
	'elementBrowserPmPlugin',
);

/**
 * For insert menu in right rail experiment
 * - Clean up ticket ED-24801
 */
export const elementBrowserPmPlugin = () =>
	new SafePlugin<ElementBrowserPmPluginState>({
		key: elementBrowserPmKey,
		state: {
			init() {
				return {
					menuBrowserOpen: false,
				};
			},
			apply(tr, pluginState) {
				const meta = tr.getMeta(elementBrowserPmKey);

				if (!meta) {
					return pluginState;
				}
				return {
					menuBrowserOpen: !pluginState.menuBrowserOpen,
				};
			},
		},
	});
