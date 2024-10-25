import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import type { CoordinationClient } from '../engagementPlatformPluginType';
import { engagementPlatformPmPluginCommand } from '../pmPlugins/engagementPlatformPmPlugin/engagementPlatformPmPluginCommand';

import type { EngagementPlatformPluginApi } from './types';

export function startMessage(
	api: EngagementPlatformPluginApi | undefined,
	coordinationClient: CoordinationClient,
) {
	return (messageId: string, variationId?: string): Promise<boolean> => {
		if (!api) {
			return Promise.resolve(false);
		}

		// If the message is already started (even with `false` state), return the state
		const messageStates = api.engagementPlatform.sharedState.currentState()?.messageStates ?? {};
		const messageState = messageStates[messageId];
		if (messageState !== undefined) {
			return Promise.resolve(messageState);
		}

		// If there is already a start message promise, return it to prevent multiple start requests
		const startMessagePromises =
			api.engagementPlatform.sharedState.currentState()?.startMessagePromises ?? {};
		const startMessagePromise = startMessagePromises[messageId];
		if (startMessagePromise) {
			return startMessagePromise;
		}

		const newStartedMessagePromise = coordinationClient
			.start(messageId, variationId)
			.then((isStarted) => {
				// Update the message state in the shared state
				api.core.actions.execute(
					engagementPlatformPmPluginCommand({
						type: 'setMessageState',
						messageId,
						state: isStarted,
					}),
				);

				return isStarted;
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
						type: 'setStartMessagePromise',
						messageId,
						promise: undefined,
					}),
				);
			});

		// Store the promise in the shared state to prevent multiple start requests for the same message
		api.core.actions.execute(
			engagementPlatformPmPluginCommand({
				type: 'setStartMessagePromise',
				messageId,
				promise: newStartedMessagePromise,
			}),
		);

		return newStartedMessagePromise;
	};
}
