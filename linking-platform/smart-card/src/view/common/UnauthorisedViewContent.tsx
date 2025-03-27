import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor } from '@atlaskit/primitives';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { CONTENT_URL_3P_ACCOUNT_AUTH, CONTENT_URL_SECURITY_AND_PERMISSIONS } from '../../constants';
import { messages } from '../../messages';

type UnauthorisedViewContentProps = {
	/**
	 * Is the name of the provider for the account that needs to be connected
	 * Eg. Google, Microsoft etc
	 */
	providerName?: string;

	/**
	 * If `true`, display an alternative message which prompts user to connect all
	 * Atlassian products (vs. smart links only) to the 3rd party account.
	 */
	isProductIntegrationSupported?: boolean;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};

/**
 * This component is used in unauthorized views of a smart link.
 * It represents the main text that provides a user with information on how to connect their account
 */
const UnauthorisedViewContent = ({
	providerName,
	isProductIntegrationSupported,
	testId = 'unauthorised-view-content',
}: UnauthorisedViewContentProps) => {
	const { fireEvent } = useAnalyticsEvents();

	const handleLearnMoreClick = useCallback(() => {
		fireEvent('ui.button.clicked.learnMore', {});
	}, [fireEvent]);

	const learnMoreMessage = isProductIntegrationSupported
		? messages.learn_more_about_connecting_account
		: messages.learn_more_about_smart_links;

	return (
		<>
			{providerName ? (
				<FormattedMessage
					{...messages.connect_unauthorised_account_description}
					values={{ context: providerName }}
				/>
			) : (
				<FormattedMessage {...messages.connect_unauthorised_account_description_no_provider} />
			)}{' '}
			{fg('platform-linking-visual-refresh-v1') ? (
				<Anchor
					href={
						isProductIntegrationSupported
							? CONTENT_URL_3P_ACCOUNT_AUTH
							: CONTENT_URL_SECURITY_AND_PERMISSIONS
					}
					target="_blank"
					testId={`${testId}-learn-more`}
					onClick={handleLearnMoreClick}
				>
					<FormattedMessage {...learnMoreMessage} />
				</Anchor>
			) : (
				<a
					href={
						isProductIntegrationSupported
							? CONTENT_URL_3P_ACCOUNT_AUTH
							: CONTENT_URL_SECURITY_AND_PERMISSIONS
					}
					target="_blank"
					data-testid={`${testId}-learn-more`}
					onClick={handleLearnMoreClick}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{ textDecoration: 'underline' }}
				>
					<FormattedMessage {...learnMoreMessage} />
				</a>
			)}
		</>
	);
};

export default UnauthorisedViewContent;
