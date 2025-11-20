import React, { useCallback } from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor } from '@atlaskit/primitives/compiled';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { CONTENT_URL_3P_ACCOUNT_AUTH, CONTENT_URL_SECURITY_AND_PERMISSIONS } from '../../constants';
import { messages } from '../../messages';
import { type CardInnerAppearance } from '../Card/types';

type UnauthorisedViewContentProps = {
	/**
	 * The type of card this component is being used in.
	 * Determines the display behavior and messaging.
	 */
	appearance?: CardInnerAppearance;

	/**
	 * If `true`, display an alternative message which prompts user to connect all
	 * Atlassian products (vs. smart links only) to the 3rd party account.
	 */
	isProductIntegrationSupported?: boolean;

	/**
	 * Is the name of the provider for the account that needs to be connected
	 * Eg. Google, Microsoft etc
	 */
	providerName?: string;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};

type HovercardExperimentCohort = 'control' | 'test1' | 'test2' | 'test3' | 'test4';

const cohortMessages: Record<HovercardExperimentCohort, MessageDescriptor> = {
	control: messages.connect_unauthorised_account_description,
	test1: messages.experiment_connect_hovercard_description_1,
	test2: messages.experiment_connect_hovercard_description_2,
	test3: messages.experiment_connect_hovercard_description_3,
	test4: messages.connect_unauthorised_account_description,
};

/**
 * This component is used in unauthorized views of a smart link.
 * It represents the main text that provides a user with information on how to connect their account
 */
const UnauthorisedViewContent = ({
	providerName,
	isProductIntegrationSupported,
	testId = 'unauthorised-view-content',
	appearance,
}: UnauthorisedViewContentProps): React.JSX.Element => {
	const { fireEvent } = useAnalyticsEvents();

	const handleLearnMoreClick = useCallback(() => {
		fireEvent('ui.button.clicked.learnMore', {});
	}, [fireEvent]);

	const hoverCardExperimentCohort =
		providerName === 'Google' && appearance === 'hoverCardPreview'
			? FeatureGates.getExperimentValue<HovercardExperimentCohort>(
					'platform_editor_google_hovercard_experiment',
					'cohort',
					'control',
				)
			: 'control';

	let learnMoreMessage;
	if (isProductIntegrationSupported) {
		if (hoverCardExperimentCohort === 'control') {
			learnMoreMessage = fg('product-terminology-refresh')
				? messages.learn_more_about_connecting_account_appify
				: messages.learn_more_about_connecting_account;
		} else {
			learnMoreMessage = messages.experiment_learn_more_about_smart_links;
		}
	} else {
		learnMoreMessage = messages.learn_more_about_smart_links;
	}

	let unauthorizedAccountDescriptionMessage;
	if (hoverCardExperimentCohort === 'control') {
		unauthorizedAccountDescriptionMessage = fg('product-terminology-refresh')
			? messages.connect_unauthorised_account_description_appify
			: messages.connect_unauthorised_account_description;
	} else {
		unauthorizedAccountDescriptionMessage = cohortMessages[hoverCardExperimentCohort];
	}

	return (
		<>
			{providerName ? (
				<FormattedMessage
					{...unauthorizedAccountDescriptionMessage}
					values={{ context: providerName }}
				/>
			) : (
				<FormattedMessage
					{...(fg('product-terminology-refresh')
						? messages.connect_unauthorised_account_description_no_provider_appify
						: messages.connect_unauthorised_account_description_no_provider)}
				/>
			)}{' '}
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
		</>
	);
};

export default UnauthorisedViewContent;
