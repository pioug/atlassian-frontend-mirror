/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { type JsonLd } from 'json-ld-types';
import { FormattedMessage } from 'react-intl-next';

import { extractProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';
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

const connectButtonStylesOld = css({
	justifyContent: 'flex-end',
	marginTop: token('space.100', '0.5rem'),
});

const connectButtonStyles = css({
	justifyContent: 'flex-end',
	marginTop: token('space.100'),
});

const titleBlockStylesOld = css({
	gap: '0.5rem 0.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	a: {
		fontWeight: token('font.weight.medium'),
	},
});

const titleBlockStyles = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
});

const mainTextStylesOld = css({
	marginTop: token('space.100', '0.5rem'),
	font: token('font.body.UNSAFE_small'),
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
	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const providerName = extractProvider(data)?.text;
	const isProductIntegrationSupported = hasAuthScopeOverrides(cardState.details);
	const { authorize } = useSmartCardActions(id, url);
	const { fireEvent } = useAnalyticsEvents();

	const handleAuthorize = useCallback(() => {
		if (authorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			authorize(CardDisplay.HoverCardPreview);
		}
	}, [authorize, fireEvent]);

	const actions = useMemo<ActionItem[]>(
		() => [
			{
				name: ActionName.CustomAction,
				content: (
					<FormattedMessage
						{...messages.connect_unauthorised_account_action}
						values={{ context: providerName }}
					/>
				),
				onClick: handleAuthorize,
			} as CustomActionItem,
		],
		[handleAuthorize, providerName],
	);

	return (
		<FlexibleCard {...flexibleCardProps} testId={testId}>
			<CustomBlock
				css={[fg('platform-linking-visual-refresh-v1') ? titleBlockStyles : titleBlockStylesOld]}
				testId={`${testId}-title`}
			>
				<LinkIcon />
				<FormattedMessage
					{...messages.connect_link_account_card_name}
					values={{ context: providerName }}
				/>
			</CustomBlock>
			<CustomBlock
				css={[fg('platform-linking-visual-refresh-v1') ? mainTextStyles : mainTextStylesOld]}
				testId={`${testId}-content`}
			>
				<div>
					<UnauthorisedViewContent
						providerName={providerName}
						isProductIntegrationSupported={isProductIntegrationSupported}
					/>
				</div>
			</CustomBlock>
			<CustomBlock
				css={[
					fg('platform-linking-visual-refresh-v1') ? connectButtonStyles : connectButtonStylesOld,
				]}
				testId={`${testId}-button`}
			>
				<ActionGroup items={actions} appearance="primary" />
			</CustomBlock>
		</FlexibleCard>
	);
};

export default HoverCardUnauthorisedView;
