import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';

import { ELEMENTS_CHANNEL } from '../_constants';
import { buildSliPayload } from './build-sli-payload';

export const fireSliAnalyticsEvent: any =
	(props: WithAnalyticsEventsProps) =>
	(actionSubject: string, action: string): void => {
		if (props.createAnalyticsEvent) {
			const eventPayload = buildSliPayload(actionSubject, action);
			props.createAnalyticsEvent(eventPayload).fire(ELEMENTS_CHANNEL);
		}
	};
