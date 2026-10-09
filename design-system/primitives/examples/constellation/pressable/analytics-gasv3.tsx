import React, { useCallback } from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { ANALYTICS_BRIDGE_CHANNEL } from '@atlassian/analytics-bridge/constants';
import { extractAWCDataFromEvent } from '@atlassian/analytics-bridge/extract-awc-data-from-event';
import { fireUIAnalytics } from '@atlassian/analytics-bridge/fire-analytics/fire-analytics';

export default function AnalyticsGASv3(): React.JSX.Element {
	const handleEvent = useCallback((event: UIAnalyticsEvent, channel?: string) => {
		console.log(`Channel: '${channel}'`, extractAWCDataFromEvent(event));
	}, []);

	const handleClick = useCallback(
		(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => {
			fireUIAnalytics(analyticsEvent, 'theActionSubjectId');
		},
		[],
	);

	return (
		<AnalyticsListener channel={ANALYTICS_BRIDGE_CHANNEL} onEvent={handleEvent}>
			<Pressable
				onClick={handleClick}
				analyticsContext={{
					attributes: {
						color: 'blue',
						someId: 937458,
					},
				}}
			>
				Fire GASv3 compatible event
			</Pressable>
		</AnalyticsListener>
	);
}
