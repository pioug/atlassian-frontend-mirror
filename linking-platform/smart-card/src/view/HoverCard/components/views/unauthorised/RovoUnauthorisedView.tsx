/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { IconTile } from '@atlaskit/icon';
import type { IconTileProps } from '@atlaskit/icon';
import AiSparkleIcon from '@atlaskit/icon/core/ai-sparkle';
import AppSwitcherIcon from '@atlaskit/icon/core/app-switcher';
import GlobeIcon from '@atlaskit/icon/core/globe';
import SearchIcon from '@atlaskit/icon/core/search';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { CardDisplay } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useSmartCardActions } from '../../../../../state/actions';

import { type HoverCardUnauthorisedProps } from './types';

const ROVO_FEATURES = [
	{
		icon: GlobeIcon,
		appearance: 'blue' as IconTileProps['appearance'],
		titleMessage: messages.rovo_unauthorised_feature_document_summaries_title,
		descMessage: messages.rovo_unauthorised_feature_document_summaries_desc,
		testIdSuffix: 'document-summaries',
	},
	{
		icon: SearchIcon,
		appearance: 'purple' as IconTileProps['appearance'],
		titleMessage: messages.rovo_unauthorised_feature_related_content_title,
		descMessage: messages.rovo_unauthorised_feature_related_content_desc,
		testIdSuffix: 'related-content',
	},
	{
		icon: AiSparkleIcon,
		appearance: 'orange' as IconTileProps['appearance'],
		titleMessage: messages.rovo_unauthorised_feature_smart_suggestions_title,
		descMessage: messages.rovo_unauthorised_feature_smart_suggestions_desc,
		testIdSuffix: 'smart-suggestions',
	},
	{
		icon: AppSwitcherIcon,
		appearance: 'teal' as IconTileProps['appearance'],
		titleMessage: messages.rovo_unauthorised_feature_cross_reference_title,
		descMessage: messages.rovo_unauthorised_feature_cross_reference_desc,
		testIdSuffix: 'cross-reference',
	},
] as const;

const layoutStyles = cssMap({
	header: {
		backgroundColor: token('color.background.brand.bold', '#0052CC'),
		color: token('color.text.inverse', '#FFFFFF'),
		paddingTop: token('space.150'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		borderTopLeftRadius: token('radius.large', '8px'),
		borderTopRightRadius: token('radius.large', '8px'),
	},
	body: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	footer: {
		marginTop: token('space.200'),
		paddingTop: token('space.150'),
	},
	footerActions: {
		display: 'flex',
		gap: token('space.150'),
		alignItems: 'center',
		justifyContent: 'flex-end',
		flexWrap: 'wrap',
	},
});

const RovoUnauthorisedView = ({
	id = '',
	flexibleCardProps,
	onDismiss,
	testId = 'hover-card-rovo-unauthorised-view',
	url,
}: HoverCardUnauthorisedProps) => {
	const providerName = useMemo(
		() => extractSmartLinkProvider(flexibleCardProps.cardState.details)?.text,
		[flexibleCardProps.cardState.details],
	);
	const { authorize } = useSmartCardActions(id, url);
	const { fireEvent } = useAnalyticsEvents();

	const handleAuthorize = useCallback(() => {
		if (authorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			authorize(CardDisplay.HoverCardPreview);
		}
	}, [authorize, fireEvent]);

	return (
		<Box testId={testId}>
			{/* Header */}
			<Box xcss={layoutStyles.header}>
				<Text weight="bold" size="medium" color="color.text.inverse">
					{providerName ? (
						<FormattedMessage
							{...messages.rovo_unauthorised_title}
							values={{ context: providerName }}
						/>
					) : (
						<FormattedMessage {...messages.rovo_unauthorised_title_no_provider} />
					)}
				</Text>
			</Box>

			{/* Body */}
			<Box xcss={layoutStyles.body}>
				<Stack space="space.050">
					<Stack space="space.200">
						{ROVO_FEATURES.map((feature) => (
							<Inline
								key={feature.testIdSuffix}
								space="space.100"
								alignBlock="center"
								testId={`${testId}-feature-row-${feature.testIdSuffix}`}
							>
								<IconTile
									icon={feature.icon}
									label={''}
									appearance={feature.appearance}
									size="medium"
									testId={`${testId}-feature-${feature.testIdSuffix}`}
								/>
								<Stack space="space.025">
									<Text size="small" weight="bold">
										<FormattedMessage {...feature.titleMessage} />
									</Text>
									<Text size="small" color="color.text.subtlest">
										<FormattedMessage {...feature.descMessage} />
									</Text>
								</Stack>
							</Inline>
						))}
					</Stack>

					<Box xcss={layoutStyles.footer}>
						<Box xcss={layoutStyles.footerActions}>
							<Button appearance="subtle" onClick={onDismiss} testId={`${testId}-not-now`}>
								<FormattedMessage {...messages.rovo_unauthorised_not_now} />
							</Button>
							<Button
								appearance="primary"
								onClick={handleAuthorize}
								testId={`${testId}-connect-account`}
							>
								<FormattedMessage {...messages.rovo_unauthorised_connect_account} />
							</Button>
						</Box>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
};

export default RovoUnauthorisedView;
