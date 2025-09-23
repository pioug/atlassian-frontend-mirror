import React, { useEffect } from 'react';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import AkSpinner from '@atlaskit/spinner';
import type { AnalyticsEventAttributes } from '@atlaskit/teams-app-internal-analytics';

import { SpinnerContainer } from '../../styled/UserTrigger';
import { type ProfileType } from '../../types';
import { getActionSubject, PACKAGE_META_DATA, profileCardRendered } from '../../util/analytics';
import { getPageTime } from '../../util/performance';

interface AnalyticsProps {
	fireAnalytics?: (payload: AnalyticsEventPayload) => void;
	fireAnalyticsNext?: <K extends keyof AnalyticsEventAttributes>(
		eventKey: K,
		attributes: AnalyticsEventAttributes[K],
	) => void;
	profileType: ProfileType;
}

export const LoadingState = ({ fireAnalytics, fireAnalyticsNext, profileType }: AnalyticsProps) => {
	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			if (fireAnalyticsNext) {
				fireAnalyticsNext(`ui.${getActionSubject(profileType)}.rendered.spinner`, {
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
			}
		} else {
			if (fireAnalytics) {
				fireAnalytics(profileCardRendered(profileType, 'spinner'));
			}
		}
	}, [fireAnalytics, fireAnalyticsNext, profileType]);

	return (
		<SpinnerContainer>
			<AkSpinner />
		</SpinnerContainer>
	);
};
