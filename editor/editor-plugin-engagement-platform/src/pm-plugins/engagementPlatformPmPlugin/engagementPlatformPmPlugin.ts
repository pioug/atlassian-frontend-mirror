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
					startMessagePromises: {},
					stopMessagePromises: {},
					epComponents: pluginConfig.epComponents,
					epHooks: pluginConfig.epHooks,
					coordinationClient: pluginConfig.coordinationClient,
				} satisfies EngagementPlatformPmPluginState;
			},
			apply: (tr: ReadonlyTransaction, pluginState: EngagementPlatformPmPluginState) => {
				const meta: EngagementPlatformPmPluginTrMeta | undefined = tr.getMeta(
					engagementPlatformPmPluginKey,
				);
				if (!meta) {
					return pluginState;
				}

				let state = { ...pluginState };
				for (const command of meta.commands) {
					switch (command.type) {
						case 'setMessageState':
							state = {
								...state,
								messageStates: {
									...state.messageStates,
									[command.messageId]: command.state,
								},
							};
							break;
						case 'setStartMessagePromise':
							if (command.promise !== undefined) {
								state = {
									...state,
									startMessagePromises: {
										...state.startMessagePromises,
										[command.messageId]: command.promise,
									},
								};
								break;
							} else {
								// If the promise is undefined, remove it from the state
								const { [command.messageId]: _, ...startMessagePromises } =
									state.startMessagePromises;
								state = {
									...state,
									startMessagePromises,
								};
							}
							break;
						case 'setStopMessagePromise':
							if (command.promise !== undefined) {
								state = {
									...state,
									stopMessagePromises: {
										...state.stopMessagePromises,
										[command.messageId]: command.promise,
									},
								};
								break;
							} else {
								// If the promise is undefined, remove it from the state
								const { [command.messageId]: _, ...stopMessagePromises } =
									state.stopMessagePromises;
								state = {
									...state,
									stopMessagePromises,
								};
							}
							break;
					}
				}

				return state;
			},
		},
	});
};
