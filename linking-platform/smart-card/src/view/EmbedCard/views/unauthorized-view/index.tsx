import React, { useCallback, useMemo } from 'react';

import { FormattedMessage } from 'react-intl-next';

import ButtonOld from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../messages';
import UnauthorisedViewContent from '../../../common/UnauthorisedViewContent';
import UnresolvedView from '../unresolved-view';

import { type UnauthorizedViewProps } from './types';
import { UnauthorizedSVG } from './unauthorized-svg';

const UnauthorizedView = ({
	context,
	extensionKey,
	isProductIntegrationSupported,
	onAuthorize,
	testId = 'embed-card-unauthorized-view',
	...unresolvedViewProps
}: UnauthorizedViewProps) => {
	const { fireEvent } = useAnalyticsEvents();

	const handleOnAuthorizeClick = useCallback(() => {
		if (onAuthorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			onAuthorize();
		}
	}, [onAuthorize, fireEvent]);

	const content = useMemo(() => {
		const ButtonComponent = fg('platform-smart-card-remove-legacy-button') ? Button : ButtonOld;

		if (onAuthorize) {
			// Our title and button messages always expect the product name to be present
			// while the description support when product name is not present.
			// To be looked at https://product-fabric.atlassian.net/browse/EDM-8173
			const values = { context: context?.text ?? '' };
			if (values) {
				// title: Connect your {context} account
				// button: Connect to {context}
				return {
					title: <FormattedMessage {...messages.connect_link_account_card_name} values={values} />,
					description: (
						<UnauthorisedViewContent
							providerName={context?.text}
							isProductIntegrationSupported={isProductIntegrationSupported}
							testId={testId}
						/>
					),
					button: (
						<ButtonComponent
							testId="connect-account"
							appearance="primary"
							onClick={handleOnAuthorizeClick}
						>
							<FormattedMessage {...messages.connect_unauthorised_account_action} values={values} />
						</ButtonComponent>
					),
				};
			}
		}

		const values = context?.text ? { context: context?.text } : undefined;
		if (values) {
			// title: We can't display private pages from {context}
			// description: You're trying to preview a link to a private {context} page. We recommend you review the URL or contact the page owner.
			return {
				title: <FormattedMessage {...messages.unauthorised_account_name} values={values} />,
				description: (
					<FormattedMessage {...messages.unauthorised_account_description} values={values} />
				),
			};
		}

		// title: We can't display private pages
		// description: You're trying to preview a link to a private page. We recommend you review the URL or contact the page owner.
		return {
			title: <FormattedMessage {...messages.unauthorised_account_name_no_provider} />,
			description: <FormattedMessage {...messages.unauthorised_account_description_no_provider} />,
		};
	}, [context?.text, handleOnAuthorizeClick, isProductIntegrationSupported, onAuthorize, testId]);

	return (
		<UnresolvedView
			{...unresolvedViewProps}
			{...content}
			icon={context?.icon}
			image={context?.image ?? <UnauthorizedSVG />}
			testId={testId}
			text={context?.text}
		/>
	);
};

export default UnauthorizedView;
