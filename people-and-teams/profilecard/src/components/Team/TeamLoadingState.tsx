import React, { useEffect } from 'react';

import Spinner from '@atlaskit/spinner';

import { CardContent, CardHeader, CardWrapper, LoadingWrapper } from '../../styled/TeamTrigger';
import { type AnalyticsFunction } from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { getPageTime } from '../../util/performance';

export default (props: { analytics: AnalyticsFunction }): React.JSX.Element => {
	const { analytics } = props;

	useEffect(() => {
		analytics('ui.teamProfileCard.rendered.spinner', (duration) => ({
			duration,
			firedAt: Math.round(getPageTime()),
			...PACKAGE_META_DATA,
		}));
	}, [analytics]);

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
