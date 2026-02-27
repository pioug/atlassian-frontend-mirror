import React, { useEffect } from 'react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import { Text } from '@atlaskit/primitives/compiled';
import type { FireEventType } from '@atlaskit/teams-app-internal-analytics';

import messages from '../../messages';
import { ErrorTitle, ErrorWrapper } from '../../styled/Error';
import { type ProfileCardErrorType } from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';

interface Props {
	reload?: () => void | undefined;
	errorType?: ProfileCardErrorType;
	fireAnalytics: FireEventType;
}

const ErrorMessage = (props: Props): React.JSX.Element => {
	const errorType = props.errorType || { reason: 'default' };
	const errorReason = errorType.reason;

	const { fireAnalytics, reload } = props;

	const hasRetry = !!reload;

	useEffect(() => {
		fireAnalytics('ui.profilecard.rendered.error', {
			hasRetry,
			errorType: errorReason,
			firedAt: Math.round(performance.now()),
			...PACKAGE_META_DATA,
		});
	}, [errorReason, fireAnalytics, hasRetry]);

	const errorContent = () => {
		if (errorReason === 'NotFound') {
			return (
				<ErrorTitle>
					<FormattedMessage {...messages.errorUserNotFound} />
				</ErrorTitle>
			);
		}

		return (
			<ErrorTitle>
				<FormattedMessage {...messages.errorGeneric} />
				<br />
				{reload && (
					<Text color="color.text.subtlest">
						<FormattedMessage {...messages.errorRetrySuggestion} />
					</Text>
				)}
			</ErrorTitle>
		);
	};

	return (
		<ErrorWrapper testId="profilecard-error">
			<CrossCircleIcon label="icon error" />
			{errorContent()}
			{reload && (
				<Button onClick={reload}>
					<FormattedMessage {...messages.errorTryAgain} />
				</Button>
			)}
		</ErrorWrapper>
	);
};

export default ErrorMessage;
