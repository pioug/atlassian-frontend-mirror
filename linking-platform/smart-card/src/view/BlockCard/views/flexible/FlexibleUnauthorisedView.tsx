/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type JsonLd } from 'json-ld-types';
import { FormattedMessage } from 'react-intl-next';

import { extractProvider } from '@atlaskit/link-extractors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';
import { getExtensionKey, hasAuthScopeOverrides } from '../../../../state/helpers';
import UnauthorisedViewContent from '../../../common/UnauthorisedViewContent';
import { type ActionItem } from '../../../FlexibleCard/components/blocks/types';
import { AuthorizeAction } from '../../actions/flexible/AuthorizeAction';

import { type FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

const contentStyles = css({
	color: token('color.text.subtlest', '#626F86'),
	marginTop: token('space.100', '0.5rem'),
	fontSize: '0.75rem',
});

/**
 * This view represents a Block card that has an 'Unauthorized' status .
 * It should have a "Connect" button that will allow a user to connect their account and view the block card.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleUnauthorisedView = ({
	testId = 'smart-block-unauthorized-view',
	...props
}: FlexibleBlockCardProps) => {
	const { analytics, cardState, onAuthorize } = props;
	const extensionKey = getExtensionKey(cardState?.details) ?? '';
	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const providerName = extractProvider(data)?.text;
	const isProductIntegrationSupported = hasAuthScopeOverrides(cardState?.details);

	const handleAuthorize = useCallback(() => {
		if (onAuthorize) {
			analytics?.track.appAccountAuthStarted({
				extensionKey,
			});

			onAuthorize();
		}
	}, [onAuthorize, extensionKey, analytics?.track]);

	const content = useMemo(
		() =>
			onAuthorize ? (
				<UnauthorisedViewContent
					providerName={providerName}
					isProductIntegrationSupported={isProductIntegrationSupported}
					analytics={analytics}
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
		[analytics, isProductIntegrationSupported, onAuthorize, providerName, testId],
	);

	const actions = useMemo<ActionItem[]>(
		() => (onAuthorize ? [AuthorizeAction(handleAuthorize, providerName)] : []),
		[handleAuthorize, onAuthorize, providerName],
	);

	return (
		<UnresolvedView {...props} actions={actions} testId={testId}>
			<div css={contentStyles} data-testid={`${testId}-content`}>
				{content}
			</div>
		</UnresolvedView>
	);
};

export default withFlexibleUIBlockCardStyle(FlexibleUnauthorisedView);
