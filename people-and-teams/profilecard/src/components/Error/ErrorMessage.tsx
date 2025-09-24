import React, { useEffect } from 'react';

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import IconError from '@atlaskit/icon/glyph/cross-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import type { AnalyticsEventAttributes } from '@atlaskit/teams-app-internal-analytics';

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

const ErrorMessage = (props: Props) => {
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
			return <ErrorTitle>The user is no longer available for the site</ErrorTitle>;
		}

		return (
			<ErrorTitle>
				Oops, looks like we’re having issues
				<br />
				{reload && (
					<Text color="color.text.subtlest">Try again and we’ll give it another shot</Text>
				)}
			</ErrorTitle>
		);
	};

	return (
		<ErrorWrapper testId="profilecard-error">
			<CrossCircleIcon label="icon error" LEGACY_fallbackIcon={IconError} LEGACY_size="xlarge" />
			{errorContent()}
			{reload && <Button onClick={reload}>Try again</Button>}
		</ErrorWrapper>
	);
};

export default ErrorMessage;
