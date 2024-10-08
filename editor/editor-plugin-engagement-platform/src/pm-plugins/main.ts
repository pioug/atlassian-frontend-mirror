import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type {
	EngagementPlatformPluginOptions,
	EngagementPlatformPluginState,
} from '../engagementPlatformPluginType';

export const engagementPlatformPluginKey = new PluginKey<EngagementPlatformPluginState>(
	'engagementPlatformPlugin',
);

export const createPlugin = (pluginOptions: EngagementPlatformPluginOptions) => {
	return new SafePlugin({
		key: engagementPlatformPluginKey,

		state: {
			init: () => {
				if (!pluginOptions) {
					return undefined;
				}

				return {
					epComponents: pluginOptions.epComponents,
					epHooks: pluginOptions.epHooks,
					coordinationClient: pluginOptions.coordinationClient,
				};
			},
			apply: (_tr: ReadonlyTransaction, pluginState: EngagementPlatformPluginState) => {
				return pluginState;
			},
		},
	});
};
