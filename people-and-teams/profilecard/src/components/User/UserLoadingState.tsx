import React, { useEffect } from 'react';

import AkSpinner from '@atlaskit/spinner';
import { type FireEventType } from '@atlaskit/teams-app-internal-analytics';

import { SpinnerContainer } from '../../styled/UserTrigger';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { getPageTime } from '../../util/performance';
interface AnalyticsProps {
	fireAnalytics: FireEventType;
}

const UserLoadingState = ({ fireAnalytics }: AnalyticsProps): React.JSX.Element => {
	useEffect(() => {
		fireAnalytics('ui.profilecard.rendered.spinner', {
			firedAt: Math.round(getPageTime()),
			...PACKAGE_META_DATA,
		});
	}, [fireAnalytics]);

	return (
		<SpinnerContainer>
			<AkSpinner />
		</SpinnerContainer>
	);
};

export default UserLoadingState;
