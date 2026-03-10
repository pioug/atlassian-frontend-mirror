import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';

import messages from '../../messages';
import { AccessLockSVGWrapper, TeamForbiddenErrorStateWrapper } from '../../styled/TeamCard';
import { type AnalyticsFunction } from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { getPageTime } from '../../util/performance';
import AccessLockSVG from '../Error/AccessLockSVG';

export default (props: { analytics: AnalyticsFunction }): React.JSX.Element => {
	const { analytics } = props;
	const intl = useIntl();

	useEffect(() => {
		analytics('ui.teamProfileCard.rendered.error', (duration) => ({
			duration,
			firedAt: Math.round(getPageTime()),
			...PACKAGE_META_DATA,
		}));
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
