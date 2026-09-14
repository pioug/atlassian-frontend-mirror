import React, { useEffect } from 'react';

import AkSpinner from '@atlaskit/spinner/spinner';
import type { AnalyticsEventAttributes } from '@atlaskit/teams-app-internal-analytics/analytics/types';

import { SpinnerContainer } from '../../styled/UserTrigger';
import { type ProfileType } from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { getActionSubject } from '../../util/getActionSubject';
import { getPageTime } from '../../util/performance';

interface AnalyticsProps {
	fireAnalytics?: <K extends keyof AnalyticsEventAttributes>(
		eventKey: K,
		attributes: AnalyticsEventAttributes[K],
	) => void;
	profileType: ProfileType;
}

export const LoadingState = ({ fireAnalytics, profileType }: AnalyticsProps): React.JSX.Element => {
	useEffect(() => {
		if (fireAnalytics) {
			fireAnalytics(`ui.${getActionSubject(profileType)}.rendered.spinner`, {
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			});
		}
	}, [fireAnalytics, profileType]);

	return (
		<SpinnerContainer>
			<AkSpinner />
		</SpinnerContainer>
	);
};
