import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import type { CoordinationClient } from '../engagementPlatformPluginType';
import { engagementPlatformPmPluginCommand } from '../pmPlugins/engagementPlatformPmPlugin/engagementPlatformPmPluginCommand';

import type { EngagementPlatformPluginApi } from './types';

export function stopMessage(
	api: EngagementPlatformPluginApi | undefined,
	coordinationClient: CoordinationClient,
) {
	return (messageId: string): Promise<boolean> => {
		if (!api) {
			return Promise.resolve(false);
		}

		// If the message is already stopped, return `true`
		const messageStates = api.engagementPlatform.sharedState.currentState()?.messageStates ?? {};
		const isActive = messageStates[messageId];
		if (isActive === false) {
			return Promise.resolve(true);
		}

		// If there is already a stop message promise, return it to prevent multiple stop requests
		const stopMessagePromises =
			api.engagementPlatform.sharedState.currentState()?.stopMessagePromises ?? {};
		const stopMessagePromise = stopMessagePromises[messageId];
		if (stopMessagePromise) {
			return stopMessagePromise;
		}

		const newStopMessagePromise = coordinationClient
			.stop(messageId)
			.then((isStopped) => {
				// Update the message state in the shared state
				if (isStopped) {
					api.core.actions.execute(
						engagementPlatformPmPluginCommand({
							type: 'setMessageState',
							messageId,
							state: false,
						}),
					);
				}

				return isStopped;
			})
			.catch((error) => {
				api?.analytics?.actions.fireAnalyticsEvent({
					action: ACTION.ERRORED,
					actionSubject: ACTION_SUBJECT.ENGAGEMENT_PLATFORM,
					eventType: EVENT_TYPE.OPERATIONAL,
					attributes: {
						error: error instanceof Error ? error.message : `${error}`,
						errorStack: error instanceof Error ? error.stack : undefined,
					},
				});

				return false;
			})
			.finally(() => {
				// Remove the promise from the state after it has been resolved
				api.core.actions.execute(
					engagementPlatformPmPluginCommand({
						type: 'setStopMessagePromise',
						messageId,
						promise: undefined,
					}),
				);
			});

		// Store the promise in the shared state to prevent multiple stop requests for the same message
		api.core.actions.execute(
			engagementPlatformPmPluginCommand({
				type: 'setStopMessagePromise',
				messageId,
				promise: newStopMessagePromise,
			}),
		);

		return newStopMessagePromise;
	};
}
