/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import ButtonOld from '@atlaskit/button';
import { cssMap, jsx } from '@atlaskit/css';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LegacyLockIcon from '@atlaskit/icon/glyph/lock-filled';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { ActionButton } from '../common/action-button';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconStyledButtonOldVisualRefresh } from '../styled';
import withFrameStyleControl from '../utils/withFrameStyleControl';

import { InlineCardUnauthorizedViewOld } from './InlineCardUnauthorizedViewOld';

const styles = cssMap({
	iconWrapper: { marginRight: token('space.negative.025') },
});

export interface InlineCardUnauthorizedViewProps {
	/** The url to display */
	url: string;
	/** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
	icon?: React.ReactNode;
	/** The name of the service (e.g. Dropbox/Asana/Google/etc) to display */
	context?: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** What to do when a user hit "Try another account" button */
	onAuthorise?: () => void;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/** Enables showing a custom preview on hover of link */
	showHoverPreview?: boolean;
	/** A smart link id that may be used in analytics */
	id?: string;
	/** An identifier of the provider which will be executing the action. */
	extensionKey?: string;
	/** Truncates the card to one line */
	truncateInline?: boolean;
}

const fallbackUnauthorizedIcon = () => {
	return fg('platform-smart-card-icon-migration') ? (
		<Box as="span" xcss={styles.iconWrapper}>
			<LockLockedIcon
				color={token('color.icon.danger')}
				label="error"
				LEGACY_fallbackIcon={LegacyLockIcon}
				LEGACY_size="small"
			/>
		</Box>
	) : (
		<AKIconWrapper>
			{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19497*/}
			<LegacyLockIcon label="error" size="small" primaryColor={token('color.icon.danger', R400)} />
		</AKIconWrapper>
	);
};

const InlineCardUnauthorizedViewNew = ({
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
}: InlineCardUnauthorizedViewProps): JSX.Element => {
	const frameRef = React.useRef<HTMLSpanElement & null>(null);
	const { fireEvent } = useAnalyticsEvents();

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
		const Button = withFrameStyleControl(ButtonOld, frameRef);

		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				<Button
					component={ActionButton}
					onClick={handleConnectAccount}
					testId="button-connect-account"
				>
					<FormattedMessage {...messages.connect_link_account_card_name} values={{ context }} />
				</Button>
			);
		}

		return onAuthorise ? (
			<Button
				spacing="none"
				component={IconStyledButtonOldVisualRefresh}
				onClick={handleConnectAccount}
				testId="button-connect-account"
			>
				<FormattedMessage {...messages.connect_link_account_card_name} values={{ context }} />
			</Button>
		) : undefined;
	}, [handleConnectAccount, onAuthorise, context]);

	const inlineCardUnauthenticatedView = (
		<Frame testId={testId} isSelected={isSelected} ref={frameRef} truncateInline={truncateInline}>
			<IconAndTitleLayout
				icon={icon ? icon : fallbackUnauthorizedIcon()}
				title={url}
				link={url}
				onClick={onClick}
				titleColor={token('color.text.subtle', N500)}
			/>
			{renderActionButton()}
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

export const InlineCardUnauthorizedView = (props: InlineCardUnauthorizedViewProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <InlineCardUnauthorizedViewNew {...props} />;
	}
	return <InlineCardUnauthorizedViewOld {...props} />;
};
