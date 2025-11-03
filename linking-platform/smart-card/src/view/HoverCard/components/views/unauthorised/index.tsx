/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { ActionName, CardDisplay } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useSmartCardActions } from '../../../../../state/actions';
import { hasAuthScopeOverrides } from '../../../../../state/helpers';
import UnauthorisedViewContent from '../../../../common/UnauthorisedViewContent';
import FlexibleCard from '../../../../FlexibleCard';
import { CustomBlock } from '../../../../FlexibleCard/components/blocks';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import {
	type ActionItem,
	type CustomActionItem,
} from '../../../../FlexibleCard/components/blocks/types';
import { LinkIcon } from '../../../../FlexibleCard/components/elements';

import { type HoverCardUnauthorisedProps } from './types';

const connectButtonStyles = css({
	justifyContent: 'flex-end',
	marginTop: token('space.100'),
});

const titleBlockStyles = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
});

const mainTextStyles = css({
	marginTop: token('space.100'),
	font: token('font.body.UNSAFE_small'),
});

const HoverCardUnauthorisedView = ({
	id = '',
	flexibleCardProps,
	testId = 'hover-card-unauthorised-view',
	url,
}: HoverCardUnauthorisedProps) => {
	const { cardState } = flexibleCardProps;
	const providerName = extractSmartLinkProvider(cardState.details)?.text;
	const isProductIntegrationSupported = hasAuthScopeOverrides(cardState.details);
	const { authorize } = useSmartCardActions(id, url);
	const { fireEvent } = useAnalyticsEvents();

	const handleAuthorize = useCallback(() => {
		if (authorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			authorize(CardDisplay.HoverCardPreview);
		}
	}, [authorize, fireEvent]);

	type HovercardExperimentCohort = 'control' | 'test1' | 'test2' | 'test3' | 'test4';
	const hoverCardExperimentCohort =
		providerName === 'Google'
			? FeatureGates.getExperimentValue<HovercardExperimentCohort>(
					'platform_editor_google_hovercard_experiment',
					'cohort',
					'control',
				)
			: 'control';

	const connectActionMessage =
		hoverCardExperimentCohort === 'test1' ||
		hoverCardExperimentCohort === 'test2' ||
		hoverCardExperimentCohort === 'test3'
			? messages.experiment_connect_unauthorised_account_action
			: messages.connect_unauthorised_account_action;

	const hoverCardTitle =
		hoverCardExperimentCohort === 'test1' || hoverCardExperimentCohort === 'test2'
			? messages.experiment_connect_link_account_card_name_title
			: messages.connect_link_account_card_name;

	const actions = useMemo<ActionItem[]>(
		() => [
			{
				name: ActionName.CustomAction,
				content: <FormattedMessage {...connectActionMessage} values={{ context: providerName }} />,
				onClick: handleAuthorize,
			} as CustomActionItem,
		],
		[handleAuthorize, providerName, connectActionMessage],
	);

	if (hoverCardExperimentCohort === 'test4') {
		return null;
	}

	return (
		<FlexibleCard {...flexibleCardProps} testId={testId}>
			<CustomBlock css={[titleBlockStyles]} testId={`${testId}-title`}>
				<LinkIcon />
				<FormattedMessage {...hoverCardTitle} values={{ context: providerName }} />
			</CustomBlock>
			<CustomBlock css={[mainTextStyles]} testId={`${testId}-content`}>
				<div>
					<UnauthorisedViewContent
						providerName={providerName}
						isProductIntegrationSupported={isProductIntegrationSupported}
						appearance={hoverCardExperimentCohort !== 'control' ? 'hoverCardPreview' : undefined}
					/>
				</div>
			</CustomBlock>
			<CustomBlock css={[connectButtonStyles]} testId={`${testId}-button`}>
				<ActionGroup items={actions} appearance="primary" />
			</CustomBlock>
		</FlexibleCard>
	);
};

export default HoverCardUnauthorisedView;
