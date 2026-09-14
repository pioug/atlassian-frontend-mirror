import React, { useEffect } from 'react';

import Spinner from '@atlaskit/spinner/spinner';

import { SpinnerContainer } from '../../styled/UserTrigger';
import { type AnalyticsWithDurationProps } from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { getPageTime } from '../../util/performance';

export const LoadingView = ({
	fireAnalyticsWithDuration,
}: AnalyticsWithDurationProps): React.JSX.Element => {
	useEffect(() => {
		fireAnalyticsWithDuration('ui.profilecard.rendered.spinner', (duration) => ({
			firedAt: Math.round(getPageTime()),
			duration,
			...PACKAGE_META_DATA,
		}));
	}, [fireAnalyticsWithDuration]);

	return (
		<SpinnerContainer testId="profilecard-spinner-container">
			<Spinner />
		</SpinnerContainer>
	);
};
