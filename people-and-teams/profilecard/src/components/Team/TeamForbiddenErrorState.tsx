import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';

import messages from '../../messages';
import { AccessLockSVGWrapper, TeamForbiddenErrorStateWrapper } from '../../styled/TeamCard';
import { type AnalyticsFunction } from '../../types';
import { profileCardRendered } from '../../util/analytics';
import AccessLockSVG from '../Error/AccessLockSVG';

export default (props: { analytics: AnalyticsFunction }) => {
	const { analytics } = props;
	const intl = useIntl();

	useEffect(() => {
		analytics((duration) => profileCardRendered('team', 'error', { duration }));
	}, [analytics]);

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
