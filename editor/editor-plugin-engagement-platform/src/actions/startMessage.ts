import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import type { CoordinationClient } from '../engagementPlatformPluginType';
import { setMessageState } from '../pmPlugins/engagementPlatformPmPlugin/commands/setMessageState';

import type { EngagementPlatformPluginApi } from './types';

export function startMessage(
	api: EngagementPlatformPluginApi | undefined,
	coordinationClient: CoordinationClient,
) {
	return async (messageId: string, variationId?: string): Promise<boolean> => {
		if (!api) {
			return false;
		}

		const messageStates = api.engagementPlatform.sharedState.currentState()?.messageStates ?? {};

		const isActive = messageStates[messageId];
		if (isActive) {
			return true;
		}

		try {
			const isStarted = await coordinationClient.start(messageId, variationId);

			if (isStarted) {
				api.core.actions.execute(setMessageState(messageId, true));
			}

			return isStarted;
		} catch (error) {
			api.analytics?.actions.fireAnalyticsEvent({
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.ENGAGEMENT_PLATFORM,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					error: error instanceof Error ? error.message : `${error}`,
					errorStack: error instanceof Error ? error.stack : undefined,
				},
			});

			return false;
		}
	};
}
