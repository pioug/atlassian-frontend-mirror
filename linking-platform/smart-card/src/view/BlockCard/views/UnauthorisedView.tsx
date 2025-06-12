/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../messages';
import { hasAuthScopeOverrides } from '../../../state/helpers';
import UnauthorisedViewContent from '../../common/UnauthorisedViewContent';
import { type ActionItem } from '../../FlexibleCard/components/blocks/types';
import { AuthorizeAction } from '../actions/AuthorizeAction';

import { type FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

const contentStylesOld = css({
	color: token('color.text.subtlest', '#626F86'),
	marginTop: token('space.100', '0.5rem'),
	font: token('font.body.UNSAFE_small'),
});

const contentStyles = css({
	color: token('color.text'),
	marginTop: token('space.100'),
	font: token('font.body.UNSAFE_small'),
});

/**
 * This view represents a Block card that has an 'Unauthorized' status .
 * It should have a "Connect" button that will allow a user to connect their account and view the block card.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const UnauthorisedView = ({
	testId = 'smart-block-unauthorized-view',
	...props
}: FlexibleBlockCardProps) => {
	const { cardState, onAuthorize } = props;
	const providerName = extractSmartLinkProvider(cardState.details)?.text;

	const isProductIntegrationSupported = hasAuthScopeOverrides(cardState.details);
	const { fireEvent } = useAnalyticsEvents();

	const handleAuthorize = useCallback(() => {
		if (onAuthorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			onAuthorize();
		}
	}, [onAuthorize, fireEvent]);

	const content = useMemo(
		() =>
			onAuthorize ? (
				<UnauthorisedViewContent
					providerName={providerName}
					isProductIntegrationSupported={isProductIntegrationSupported}
					testId={testId}
				/>
			) : (
				<FormattedMessage
					{...messages[
						providerName
							? 'unauthorised_account_description'
							: 'unauthorised_account_description_no_provider'
					]}
					values={{ context: providerName }}
				/>
			),
		[isProductIntegrationSupported, onAuthorize, providerName, testId],
	);

	const actions = useMemo<ActionItem[]>(
		() => (onAuthorize ? [AuthorizeAction(handleAuthorize, providerName)] : []),
		[handleAuthorize, onAuthorize, providerName],
	);

	return (
		<UnresolvedView {...props} actions={actions} testId={testId}>
			<div
				css={[fg('platform-linking-visual-refresh-v1') ? contentStyles : contentStylesOld]}
				data-testid={`${testId}-content`}
			>
				{content}
			</div>
		</UnresolvedView>
	);
};

export default withFlexibleUIBlockCardStyle(UnauthorisedView);
