import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconStyledButton } from '../styled';
import withFrameStyleControl from '../utils/withFrameStyleControl';

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

const FallbackUnauthorizedIcon = (
	<AKIconWrapper>
		{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19497 */}
		<LockIcon label="error" size="small" primaryColor={token('color.icon.danger', R400)} />
	</AKIconWrapper>
);

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
		const ActionButton = withFrameStyleControl(Button, frameRef);

		return onAuthorise ? (
			<ActionButton
				spacing="none"
				component={IconStyledButton}
				onClick={handleConnectAccount}
				testId="button-connect-account"
			>
				<FormattedMessage {...messages.connect_link_account_card_name} values={{ context }} />
			</ActionButton>
		) : undefined;
	}, [handleConnectAccount, onAuthorise, context]);

	const inlineCardUnauthenticatedView = (
		<Frame testId={testId} isSelected={isSelected} ref={frameRef} truncateInline={truncateInline}>
			<IconAndTitleLayout
				icon={icon ? icon : FallbackUnauthorizedIcon}
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
