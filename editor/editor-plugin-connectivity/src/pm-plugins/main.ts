import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { type PluginState } from '../connectivityPluginType';

export const key = new PluginKey<PluginState>('offlineMode');

export const createPlugin = () => {
	return new SafePlugin<PluginState>({
		key,
		state: {
			init() {
				return {
					mode: 'online',
				};
			},
			apply: (tr: ReadonlyTransaction, pluginState: PluginState) => {
				const meta = tr.getMeta(key);
				if (meta) {
					return {
						mode: meta,
					};
				}
				return pluginState;
			},
		},
	});
};
