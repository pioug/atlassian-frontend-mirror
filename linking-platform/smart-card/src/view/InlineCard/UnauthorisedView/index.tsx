/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage } from 'react-intl';
import { di } from 'react-magnetic-di';

import { cssMap, jsx } from '@atlaskit/css';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../messages';
import { getCachedProviderPctMapAndRefresh } from '../../../state/services/personalization';
import { HoverCard } from '../../HoverCard';
import { ActionButton } from '../common/action-button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

export interface InlineCardUnauthorizedViewProps {
	/** The name of the service (e.g. Dropbox/Asana/Google/etc) to display */
	context?: string;
	/** An identifier of the provider which will be executing the action. */
	extensionKey?: string;
	/** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
	icon?: React.ReactNode;
	/** A smart link id that may be used in analytics */
	id?: string;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** What to do when a user hit "Try another account" button */
	onAuthorise?: () => void;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** Enables showing a custom preview on hover of link */
	showHoverPreview?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/** Truncates the card to one line */
	truncateInline?: boolean;
	/** The url to display */
	url: string;
}

const fallbackUnauthorizedIcon = () => {
	return <LockLockedIcon color={token('color.icon.danger')} label="error" />;
};

/**
 * When persisted personalization adoption from {@link getCachedProviderPctMapAndRefresh} is strictly below this value,
 * the pill uses exploratory "previewing" copy instead of a percentage headline.
 */
const SOCIAL_PROOF_TEAM_PREVIEW_THRESHOLD = 30;
const SOCIAL_PROOF_TRAIT_NAME = 'sl_3p_connected_providers_site_pct';

const socialProofPillStyles = cssMap({
	strong: {
		fontWeight: token('font.weight.bold'),
	},
	inlineContainer: {
		display: 'inline-flex',
		alignItems: 'center',
	},
	root: {
		display: 'inline',
		alignItems: 'center',
		boxSizing: 'border-box',
		maxWidth: '100%',
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.neutral.subtle.hovered'),
		color: token('color.text.subtle'),
		textAlign: 'initial',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		fontSize: '0.8em' as any,
		verticalAlign: '1px',
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingRight: token('space.075'),
		paddingLeft: token('space.075'),
		marginRight: token('space.050')
	},
	label: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	},
});

/**
 * Renders the social-proof pill and Connect button using persisted percentages only ({@link getCachedProviderPctMapAndRefresh}) — no
 * loading skeleton; either the cached percentage is shown or the legacy long connect label is used.
 *
 * Only mounted when the parent has passed the killswitch and
 * `platform_sl_3p_preauth_social_proof_inline_cta`. See platform docs: `rules-of-hooks.md` "Should §1".
 */
const UnauthorisedConnectWithSocialProof = ({
	context,
	extensionKey,
	testId,
	onConnectClick,
}: {
	context?: string;
	extensionKey?: string;
	onConnectClick: React.MouseEventHandler<HTMLElement>;
	testId: string;
}): JSX.Element => {
	di(getCachedProviderPctMapAndRefresh);
	// TODO We need to decide what should we do with FedRAMP. It will not work there (_edge/tenant_info is not available) but so maybe
	// we can just leave it like that and whole feature won't trigger befcause of that.
	const providerPctMap = getCachedProviderPctMapAndRefresh(SOCIAL_PROOF_TRAIT_NAME);
	const connectedPct =
		extensionKey && providerPctMap ? providerPctMap[extensionKey] : undefined;
	const isEnabled = true;

	const trimmedProviderDisplayName = context?.trim() ?? '';
	const hasProviderDisplayName = trimmedProviderDisplayName.length > 0;

	const isSocialProofUsageHighEnough =
		connectedPct !== undefined && connectedPct >= SOCIAL_PROOF_TEAM_PREVIEW_THRESHOLD;

	/**
	 * Persisted personalization is required. Below {@link SOCIAL_PROOF_TEAM_PREVIEW_THRESHOLD} adoption we also require
	 * a provider display name; otherwise omit the pill and use the legacy long connect treatment.
	 */
	const showSocialProofPill =
		isEnabled &&
		connectedPct !== undefined &&
		(isSocialProofUsageHighEnough || hasProviderDisplayName);

	const bold = (chunks: React.ReactNode) => (
		<Box as="strong" xcss={socialProofPillStyles.strong}>
			{chunks}
		</Box>
	);

	const socialProofPillContent = isSocialProofUsageHighEnough
		? hasProviderDisplayName
			? (
					<FormattedMessage
						{...messages.social_proof_inline_cta_tag_high_with_context}
						values={{ connectedPct, context: trimmedProviderDisplayName, b: bold }}
					/>
				)
			: (
					<FormattedMessage
						{...messages.social_proof_inline_cta_tag_high_no_context}
						values={{ connectedPct, b: bold }}
					/>
				)
		: (
				<FormattedMessage
					{...messages.social_proof_inline_cta_tag_low_with_context}
					values={{ context: trimmedProviderDisplayName }}
				/>
			);

	return (
		<React.Fragment>
			{showSocialProofPill ? (
				<Box as="span" xcss={socialProofPillStyles.root} testId={`${testId}-social-proof-tag`}>
					<Box as="span" xcss={socialProofPillStyles.label}>
						{socialProofPillContent}
					</Box>
				</Box>
			) : null}
			<ActionButton
				onClick={onConnectClick}
				viewType="unauthorised"
				testId="button-connect-account"
				isSocialProofInlineUnauthorisedConnect={showSocialProofPill}
			>
				{showSocialProofPill ? (
					<FormattedMessage {...messages.connect_inline_social_proof} />
				) : (
					<FormattedMessage {...messages.connect_link_account_card_name} values={{ context }} />
				)}
			</ActionButton>
		</React.Fragment>
	);
};

export const InlineCardUnauthorizedView = ({
	url,
	id,
	icon,
	onAuthorise,
	onClick,
	isSelected,
	testId = 'inline-card-unauthorized-view',
	showHoverPreview = false,
	truncateInline,
	context,
	extensionKey,
}: InlineCardUnauthorizedViewProps): JSX.Element => {
	const frameRef = React.useRef<HTMLSpanElement & null>(null);
	const { fireEvent } = useAnalyticsEvents();

	const isSocialProofInlineCtaEnabled =
		onAuthorise &&
		fg('platform_sl_3p_preauth_soc_proof_inline_killswitch') &&
		expValEquals(
			'platform_sl_3p_preauth_social_proof_inline_cta',
			'isEnabled',
			true,
		);

	const handleConnectAccount = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			event.preventDefault();
			event.stopPropagation();
			if (onAuthorise) {
				fireEvent('track.applicationAccount.authStarted', {});
				onAuthorise();
			}
		},
		[fireEvent, onAuthorise],
	);

	const renderActionButton = React.useCallback(() => {
		return (
			<ActionButton
				onClick={handleConnectAccount}
				viewType={'unauthorised'}
				testId="button-connect-account"
			>
				<FormattedMessage {...messages.connect_link_account_card_name} values={{ context }} />
			</ActionButton>
		);
	}, [handleConnectAccount, context]);

	const inlineCardUnauthenticatedView = (
		<Frame
			testId={testId}
			isSelected={isSelected}
			ref={frameRef}
			truncateInline={truncateInline}
			viewType="unauthorised"
		>
			<IconAndTitleLayout
				icon={icon ? icon : fallbackUnauthorizedIcon()}
				title={url}
				link={url}
				onClick={onClick}
				titleColor={token('color.text.subtle')}
			/>
			{onAuthorise &&
				(isSocialProofInlineCtaEnabled ? (
					<UnauthorisedConnectWithSocialProof
						context={context}
						extensionKey={extensionKey}
						testId={testId}
						onConnectClick={handleConnectAccount}
					/>
				) : (
					renderActionButton()
				))}
		</Frame>
	);

	if (onAuthorise && showHoverPreview) {
		return (
			<HoverCard url={url} id={id}>
				{inlineCardUnauthenticatedView}
			</HoverCard>
		);
	}

	return inlineCardUnauthenticatedView;
};
