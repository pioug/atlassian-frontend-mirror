import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type { EngagementPlatformPluginConfig } from '../../engagementPlatformPluginType';

import { engagementPlatformPmPluginKey } from './engagementPlatformPmPluginKey';
import type { EngagementPlatformPmPluginState, EngagementPlatformPmPluginTrMeta } from './types';

export const engagementPlatformPmPlugin = (pluginConfig: EngagementPlatformPluginConfig) => {
	return new SafePlugin<EngagementPlatformPmPluginState>({
		key: engagementPlatformPmPluginKey,

		state: {
			init: () => {
				return {
					messageStates: {},
					epComponents: pluginConfig.epComponents,
					epHooks: pluginConfig.epHooks,
					coordinationClient: pluginConfig.coordinationClient,
				};
			},
			apply: (tr: ReadonlyTransaction, pluginState: EngagementPlatformPmPluginState) => {
				const meta: EngagementPlatformPmPluginTrMeta | undefined = tr.getMeta(
					engagementPlatformPmPluginKey,
				);
				if (!meta) {
					return pluginState;
				}

				const newState = {
					...pluginState,
					messageStates: {
						...pluginState.messageStates,
						...meta.newMessageStates,
					},
				};

				// Remove false message states to save memory
				Object.entries(newState.messageStates).forEach(([key, value]) => {
					if (!value) {
						delete newState.messageStates[key];
					}
				});

				return newState;
			},
		},
	});
};
