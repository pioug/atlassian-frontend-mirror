import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { SelectionExtensionPluginState } from '../types';

export const selectionExtensionPluginKey = new PluginKey<SelectionExtensionPluginState>(
	'selectionExtensionPlugin',
);

export const createPlugin = () => {
	return new SafePlugin({
		key: selectionExtensionPluginKey,
		state: {
			init: () => {
				return {
					activeExtension: undefined,
				};
			},
			apply: (tr: ReadonlyTransaction, pluginState: SelectionExtensionPluginState) => {
				const meta = tr.getMeta(selectionExtensionPluginKey);

				switch (meta?.type) {
					case 'set-active-extension':
						return {
							...pluginState,
							activeExtension: meta.extension,
						};

					case 'clear-active-extension':
						return {
							...pluginState,
							activeExtension: undefined,
						};
				}

				return pluginState;
			},
		},
	});
};
