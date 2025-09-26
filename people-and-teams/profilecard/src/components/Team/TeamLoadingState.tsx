import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';

import { CardContent, CardHeader, CardWrapper, LoadingWrapper } from '../../styled/TeamTrigger';
import { type AnalyticsFunction, type AnalyticsFunctionNext } from '../../types';
import { PACKAGE_META_DATA, profileCardRendered } from '../../util/analytics';
import { getPageTime } from '../../util/performance';

export default (props: { analytics: AnalyticsFunction; analyticsNext: AnalyticsFunctionNext }) => {
	const { analytics, analyticsNext } = props;

	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.rendered.spinner', (duration) => ({
				duration,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			analytics((duration) => profileCardRendered('team', 'spinner', { duration }));
		}
	}, [analytics, analyticsNext]);

	return (
		<CardWrapper testId="team-profilecard">
			<CardHeader isLoading />
			<CardContent>
				<LoadingWrapper testId="team-profilecard-spinner">
					<Spinner />
				</LoadingWrapper>
			</CardContent>
		</CardWrapper>
	);
};
