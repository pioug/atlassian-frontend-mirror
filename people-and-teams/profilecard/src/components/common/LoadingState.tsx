import React, { useEffect } from 'react';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import AkSpinner from '@atlaskit/spinner';

import { SpinnerContainer } from '../../styled/Card';
import { type ProfileType } from '../../types';
import { profileCardRendered } from '../../util/analytics';

interface AnalyticsProps {
	fireAnalytics?: (payload: AnalyticsEventPayload) => void;
	profileType: ProfileType;
}

export const LoadingState = ({ fireAnalytics, profileType }: AnalyticsProps) => {
	useEffect(() => {
		if (fireAnalytics) {
			fireAnalytics(profileCardRendered(profileType, 'spinner'));
		}
	}, [fireAnalytics, profileType]);

	return (
		<SpinnerContainer>
			<AkSpinner />
		</SpinnerContainer>
	);
};
