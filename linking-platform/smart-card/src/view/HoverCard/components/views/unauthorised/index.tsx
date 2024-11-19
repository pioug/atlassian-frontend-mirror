import React, { useCallback, useMemo } from 'react';

import { type JsonLd } from 'json-ld-types';
import { FormattedMessage } from 'react-intl-next';

import { extractProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

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

import { connectButtonStyles, mainTextStyles, titleBlockStyles } from './styled';
import { type HoverCardUnauthorisedProps } from './types';

const HoverCardUnauthorisedView = ({
	analytics,
	extensionKey,
	id = '',
	flexibleCardProps,
	testId = 'hover-card-unauthorised-view',
	url,
}: HoverCardUnauthorisedProps) => {
	const { cardState } = flexibleCardProps;
	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const providerName = extractProvider(data)?.text;
	const isProductIntegrationSupported = hasAuthScopeOverrides(cardState.details);
	const { authorize } = useSmartCardActions(id, url, analytics);
	const { fireEvent } = useAnalyticsEvents();

	const handleAuthorize = useCallback(() => {
		if (authorize) {
			if (fg('smart-card-migrate-track-analytics')) {
				fireEvent('track.applicationAccount.authStarted', {});
			} else {
				analytics.track.appAccountAuthStarted({
					extensionKey,
				});
			}

			authorize(CardDisplay.HoverCardPreview);
		}
	}, [authorize, extensionKey, analytics.track, fireEvent]);

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
			<CustomBlock overrideCss={titleBlockStyles} testId={`${testId}-title`}>
				<LinkIcon />
				<FormattedMessage
					{...messages.connect_link_account_card_name}
					values={{ context: providerName }}
				/>
			</CustomBlock>
			<CustomBlock overrideCss={mainTextStyles} testId={`${testId}-content`}>
				<div>
					<UnauthorisedViewContent
						providerName={providerName}
						isProductIntegrationSupported={isProductIntegrationSupported}
						analytics={analytics}
					/>
				</div>
			</CustomBlock>
			<CustomBlock overrideCss={connectButtonStyles} testId={`${testId}-button`}>
				<ActionGroup items={actions} appearance="primary" />
			</CustomBlock>
		</FlexibleCard>
	);
};

export default HoverCardUnauthorisedView;
