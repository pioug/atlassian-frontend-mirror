import React, { useEffect } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import type { AnalyticsEventAttributes } from '@atlaskit/teams-app-internal-analytics';

import messages from '../../messages';
import { ErrorTitle, ErrorWrapper } from '../../styled/Error';
import { type ProfileCardErrorType } from '../../types';
import { PACKAGE_META_DATA, profileCardRendered } from '../../util/analytics';

interface Props {
	reload?: () => void | undefined;
	errorType?: ProfileCardErrorType;
	fireAnalytics: (payload: AnalyticsEventPayload) => void;
	fireAnalyticsNext: <K extends keyof AnalyticsEventAttributes>(
		eventKey: K,
		attributes: AnalyticsEventAttributes[K],
	) => void;
}

const ErrorMessage = (props: Props): React.JSX.Element => {
	const errorType = props.errorType || { reason: 'default' };
	const errorReason = errorType.reason;

	const { fireAnalytics, fireAnalyticsNext, reload } = props;

	const hasRetry = !!reload;

	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			fireAnalyticsNext('ui.profilecard.rendered.error', {
				hasRetry,
				errorType: errorReason,
				firedAt: Math.round(performance.now()),
				...PACKAGE_META_DATA,
			});
		} else {
			fireAnalytics(
				profileCardRendered('user', 'error', {
					hasRetry,
					errorType: errorReason,
				}),
			);
		}
	}, [errorReason, fireAnalytics, fireAnalyticsNext, hasRetry]);

	const errorContent = () => {
		if (errorReason === 'NotFound') {
			return (
				<ErrorTitle>
					{fg('people-teams-fix-no-literal-string-in-jsx') ? (
						<FormattedMessage {...messages.errorUserNotFound} />
					) : (
						'The user is no longer available for the site'
					)}
				</ErrorTitle>
			);
		}

		return (
			<ErrorTitle>
				{fg('people-teams-fix-no-literal-string-in-jsx') ? (
					<FormattedMessage {...messages.errorGeneric} />
				) : (
					'Oops, looks like we’re having issues'
				)}
				<br />
				{reload && (
					<Text color="color.text.subtlest">
						{fg('people-teams-fix-no-literal-string-in-jsx') ? (
							<FormattedMessage {...messages.errorRetrySuggestion} />
						) : (
							'Try again and we’ll give it another shot'
						)}
					</Text>
				)}
			</ErrorTitle>
		);
	};

	return (
		<ErrorWrapper testId="profilecard-error">
			<CrossCircleIcon label="icon error" />
			{errorContent()}
			{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
			{reload && <Button onClick={reload}>Try again</Button>}
		</ErrorWrapper>
	);
};

export default ErrorMessage;
