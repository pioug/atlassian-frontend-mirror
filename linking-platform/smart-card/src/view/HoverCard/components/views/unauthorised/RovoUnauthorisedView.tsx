/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import Button from '@atlaskit/button/new';
import AiGenerativeTextSummaryIcon from '@atlaskit/icon/core/ai-generative-text-summary';
import CoreLinkIcon from '@atlaskit/icon/core/link';
import RovoChatIcon from '@atlaskit/icon/core/rovo-chat';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { AtlassianIcon } from '@atlaskit/logo';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { CardDisplay, SmartLinkSize } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useSmartCardActions } from '../../../../../state/actions';
import FlexibleCard from '../../../../FlexibleCard';
import { LinkIcon } from '../../../../FlexibleCard/components/elements';

import { DenseSparkle, SparseSparkle, SquiglyArrow } from './graphics';
import { type HoverCardUnauthorisedProps } from './types';

const ROVO_FEATURES = [
	{
		icon: CoreLinkIcon,
		message: messages.rovo_unauthorised_feature_clear_link_names,
		testIdSuffix: 'clear-link-names',
	},
	{
		icon: AiGenerativeTextSummaryIcon,
		message: messages.rovo_unauthorised_feature_understand_linked_docs,
		testIdSuffix: 'understand-linked-docs',
	},
	{
		icon: RovoChatIcon,
		message: messages.rovo_unauthorised_feature_go_deeper_smart_suggestions,
		testIdSuffix: 'go-deeper-smart-suggestions',
	},
] as const;

const sparkleWrapBase = css({
	flexShrink: 0,
	display: 'flex',
	position: 'absolute',
});
const sparkleLeftWrap = css({
	color: token('color.icon.success', '#22A06B'),
	top: '30px',
	left: '7px',
});
const sparkleGreyRightWrap = css({
	color: token('color.background.accent.gray.subtlest.hovered'),
	top: '12px',
	right: '22px',
});
const sparkleVioletRightWrap = css({
	color: token('color.icon.accent.purple'),
	width: '22px',
	top: '40px',
	right: '7px',
});

const layoutStyles = cssMap({
	connectorStroke: {
		color: token('color.text', '#172B4D'),
		display: 'flex',
		flexShrink: 0,
	},
	atlassianIconTile: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '32px',
		height: '32px',
		borderRadius: token('radius.large', '8px'),
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	header: {
		backgroundColor: token('color.background.accent.gray.subtlest', '#F1F2F4'),
		paddingTop: token('space.300'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		borderTopLeftRadius: token('radius.large', '8px'),
		borderTopRightRadius: token('radius.large', '8px'),
		position: 'relative',
	},
	headerGraphicRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.100'),
		marginBottom: token('space.150'),
	},
	headerTitle: {
		textAlign: 'center',
	},
	body: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	featureIconCell: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
		width: '16px',
	},
	footer: {
		marginTop: token('space.150'),
		paddingTop: token('space.050'),
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

	const handleDismiss = useCallback(() => {
		if (onDismiss) {
			fireEvent('ui.button.clicked.dismiss', {});
			onDismiss();
		}
	}, [fireEvent, onDismiss]);

	return (
		<FlexibleCard
			{...flexibleCardProps}
			testId={testId}
			ui={{
				hideElevation: true,
				hideBackground: true,
				removeBlockRestriction: true,
				hidePadding: true,
			}}
		>
			<Box xcss={layoutStyles.header}>
				<div css={[sparkleWrapBase, sparkleLeftWrap]}>
					<DenseSparkle />
				</div>
				<div css={[sparkleWrapBase, sparkleGreyRightWrap]}>
					<SparseSparkle />
				</div>
				<div css={[sparkleWrapBase, sparkleVioletRightWrap]}>
					<DenseSparkle />
				</div>
				<Box xcss={layoutStyles.headerGraphicRow}>
					<LinkIcon size={SmartLinkSize.Medium} isTiledIcon />
					<Box xcss={layoutStyles.connectorStroke}>
						<SquiglyArrow />
					</Box>
					<Box xcss={layoutStyles.atlassianIconTile}>
						<AtlassianIcon appearance="inverse" size="small" />
					</Box>
				</Box>
				<Box xcss={layoutStyles.headerTitle}>
					<Text weight="bold" size="medium" color="color.text">
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
			</Box>

			<Box xcss={layoutStyles.body}>
				<Stack space="space.050">
					<Stack space="space.200">
						{ROVO_FEATURES.map((feature) => {
							const FeatureIcon = feature.icon;
							return (
								<Inline
									key={feature.testIdSuffix}
									space="space.150"
									alignBlock="center"
									testId={`${testId}-feature-${feature.testIdSuffix}`}
								>
									<Box xcss={layoutStyles.featureIconCell}>
										<FeatureIcon label="" />
									</Box>
									<Text>
										<FormattedMessage {...feature.message} />
									</Text>
								</Inline>
							);
						})}
					</Stack>

					<Box xcss={layoutStyles.footer}>
						<Inline space="space.050">
							<Button
								appearance="subtle"
								spacing="compact"
								onClick={handleDismiss}
								testId={`${testId}-not-now`}
							>
								<FormattedMessage {...messages.rovo_unauthorised_not_now} />
							</Button>
							<Button
								appearance="primary"
								onClick={handleAuthorize}
								testId={`${testId}-connect-account`}
							>
								<FormattedMessage {...messages.rovo_unauthorised_connect_account} />
							</Button>
						</Inline>
					</Box>
				</Stack>
			</Box>
		</FlexibleCard>
	);
};

export default RovoUnauthorisedView;
