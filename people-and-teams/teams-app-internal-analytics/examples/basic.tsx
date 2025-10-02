import React from 'react';

import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';

import { AnalyticsEventSource } from '../src/common/utils/constants';
import { TeamsAppAnalyticsContext } from '../src/ui/analytics-context';

import { ButtonWithAnalytics } from './helpers/button-with-analytics';
import { createAnalyticsWebClientMock } from './helpers/create-analytics-web-client-mock';

export default function Basic() {
	const analyticsClient = createAnalyticsWebClientMock();

	return (
		<FabricAnalyticsListeners client={analyticsClient}>
			<TeamsAppAnalyticsContext
				data={{
					attributes: { consumer: 'embed' },
					source: AnalyticsEventSource.TEAM_PROFILE_SCREEN,
				}}
			>
				<TeamsAppAnalyticsContext
					data={{
						attributes: { teamId: 'team-id' },
						source: AnalyticsEventSource.USER_PROFILE_SCREEN,
					}}
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
