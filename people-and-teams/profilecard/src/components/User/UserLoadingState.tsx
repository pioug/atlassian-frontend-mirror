import React, { useEffect } from 'react';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import AkSpinner from '@atlaskit/spinner';
import { type FireEventType } from '@atlaskit/teams-app-internal-analytics';

import { SpinnerContainer } from '../../styled/UserTrigger';
import { PACKAGE_META_DATA, profileCardRendered } from '../../util/analytics';
import { getPageTime } from '../../util/performance';
interface AnalyticsProps {
	fireAnalytics: (payload: AnalyticsEventPayload) => void;
	fireAnalyticsNext: FireEventType;
}

const UserLoadingState = ({
	fireAnalytics,
	fireAnalyticsNext,
}: AnalyticsProps): React.JSX.Element => {
	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			fireAnalyticsNext('ui.profilecard.rendered.spinner', {
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			});
		} else {
			fireAnalytics(profileCardRendered('user', 'spinner'));
		}
	}, [fireAnalytics, fireAnalyticsNext]);

	return (
		<SpinnerContainer>
			<AkSpinner />
		</SpinnerContainer>
	);
};

export default UserLoadingState;
