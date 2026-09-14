import { type GasPayload, OPERATIONAL_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';

import { ELEMENTS_CHANNEL } from '../_constants';
import { ComponentNames } from '../types';
import { packageName } from './package-name';
import { packageVersion } from './package-version';

export const fireAnalyticsMentionHydrationEvent: any =
	(props: WithAnalyticsEventsProps) =>
	(action: string, userId: string, fromCache: boolean, duration: number): void => {
		if (props.createAnalyticsEvent) {
			const eventPayload: GasPayload = {
				action,
				actionSubject: ComponentNames.MENTION,
				actionSubjectId: 'hydration',
				attributes: {
					packageName,
					packageVersion,
					componentName: ComponentNames.MENTION,
					userId,
					fromCache,
					duration: Math.round(duration),
				},
				eventType: OPERATIONAL_EVENT_TYPE,
			};
			const analyticsEvent: UIAnalyticsEvent = props.createAnalyticsEvent(eventPayload);
			analyticsEvent.fire(ELEMENTS_CHANNEL);
		}
	};
