import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

type ToggleInsertBlockPmPluginState = {
	showElementBrowser: boolean;
};

export const toggleInsertBlockPmKey = new PluginKey<ToggleInsertBlockPmPluginState>(
	'toggleInsertBlockPmKey',
);

export const toggleInsertBlockPmPlugin = () =>
	new SafePlugin<ToggleInsertBlockPmPluginState>({
		key: toggleInsertBlockPmKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return {
					showElementBrowser: false,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply(tr, pluginState) {
				const meta = tr.getMeta(toggleInsertBlockPmKey);

				if (!meta) {
					return pluginState;
				}
				return {
					showElementBrowser: !pluginState.showElementBrowser,
				};
			},
		},
	});
