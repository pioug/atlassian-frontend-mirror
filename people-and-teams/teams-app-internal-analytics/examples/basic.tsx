import React from 'react';

import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';

import { TeamsAppAnalyticsContext } from '../src/ui/analytics-context';

import { ButtonWithAnalytics } from './helpers/button-with-analytics';
import { createAnalyticsWebClientMock } from './helpers/create-analytics-web-client-mock';

export default function Basic() {
	const analyticsClient = createAnalyticsWebClientMock();

	return (
		<FabricAnalyticsListeners client={analyticsClient}>
			<TeamsAppAnalyticsContext
				data={{ attributes: { consumer: 'embed' }, source: 'analytics-example' }}
			>
				<TeamsAppAnalyticsContext
					data={{ attributes: { teamId: 'team-id' }, source: 'analytics-example-inner' }}
				>
					<>
						<ButtonWithAnalytics eventType="ui" />
						<ButtonWithAnalytics eventType="operational" />
						<ButtonWithAnalytics eventType="track" />
						<ButtonWithAnalytics eventType="screen" />
					</>
				</TeamsAppAnalyticsContext>
			</TeamsAppAnalyticsContext>
		</FabricAnalyticsListeners>
	);
}
