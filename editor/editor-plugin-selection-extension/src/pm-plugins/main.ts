import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { type SelectionExtensionPluginState, SelectionExtensionActionTypes } from '../types';

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
					case SelectionExtensionActionTypes.SET_ACTIVE_EXTENSION:
						return {
							...pluginState,
							activeExtension: meta.extension,
						};

					case SelectionExtensionActionTypes.CLEAR_ACTIVE_EXTENSION:
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
