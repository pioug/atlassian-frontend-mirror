import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import type { CoordinationClient } from '../engagementPlatformPluginType';
import { setMessageState } from '../pmPlugins/engagementPlatformPmPlugin/commands/setMessageState';

import type { EngagementPlatformPluginApi } from './types';

export function stopMessage(
	api: EngagementPlatformPluginApi | undefined,
	coordinationClient: CoordinationClient,
) {
	return async (messageId: string): Promise<boolean> => {
		if (!api) {
			return false;
		}

		const messageStates = api.engagementPlatform.sharedState.currentState()?.messageStates ?? {};

		const isActive = messageStates[messageId];
		if (!isActive) {
			return true;
		}

		try {
			const isStopped = await coordinationClient.stop(messageId);

			if (isStopped) {
				api.core.actions.execute(setMessageState(messageId, false));
			}

			return isStopped;
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
