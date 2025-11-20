import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { fg } from '@atlaskit/platform-feature-flags';

import messages from '../../messages';
import { AccessLockSVGWrapper, TeamForbiddenErrorStateWrapper } from '../../styled/TeamCard';
import { type AnalyticsFunction, type AnalyticsFunctionNext } from '../../types';
import { PACKAGE_META_DATA, profileCardRendered } from '../../util/analytics';
import { getPageTime } from '../../util/performance';
import AccessLockSVG from '../Error/AccessLockSVG';

export default (props: {
	analytics: AnalyticsFunction;
	analyticsNext: AnalyticsFunctionNext;
}): React.JSX.Element => {
	const { analytics, analyticsNext } = props;
	const intl = useIntl();

	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.rendered.error', (duration) => ({
				duration,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			analytics((duration) => profileCardRendered('team', 'error', { duration }));
		}
	}, [analytics, analyticsNext]);

	return (
		<TeamForbiddenErrorStateWrapper testId="team-profilecard-forbidden-error-state">
			<EmptyState
				header={intl.formatMessage(messages.teamForbiddenErrorStateTitle)}
				description={intl.formatMessage(messages.teamForbiddenErrorStateDescription)}
				renderImage={() => (
					<AccessLockSVGWrapper>
						<AccessLockSVG />
					</AccessLockSVGWrapper>
				)}
			/>
		</TeamForbiddenErrorStateWrapper>
	);
};
