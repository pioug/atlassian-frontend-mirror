/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LegacyLockIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { type RequestAccessContextProps } from '../../types';
import { ActionButton } from '../common/action-button';
import InlineLozenge from '../common/inline-lozenge';
import { Frame } from '../Frame';
import { IconAndTitleLayout, LozengeWrapper } from '../IconAndTitleLayout';

const styles = cssMap({
	iconWrapper: {
		marginRight: token('space.negative.025'),
		display: 'inline flex',
	},
	actionButtonLozengeStyleOld: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('border.radius.050'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
	},
	actionButtonLozengeStyleNew: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('border.radius.050'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),

		// Set max width to prevent button to overflow on top of other element in smaller space, e.g. inside table cell
		maxWidth: '100%',
	},
});

export interface InlineCardForbiddenViewProps {
	/** The url to display */
	url: string;
	/** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
	icon?: React.ReactNode;
	/** The name of the service (e.g. Jira/Confluence/Asana/etc) to display */
	context?: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** The optional handler for "Connect" button */
	onAuthorise?: () => void;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/* Describes additional metadata based on the type of access a user has to the link */
	requestAccessContext?: RequestAccessContextProps;
	/** Enables showing a custom preview on hover of link */
	showHoverPreview?: boolean;
	/** Truncates the card to one line */
	truncateInline?: boolean;
}

const fallbackForbiddenIcon = () => {
	return (
		<LockLockedIcon
			label="error"
			color={token('color.icon.danger')}
			LEGACY_fallbackIcon={LegacyLockIcon}
			LEGACY_size="small"
			testId="forbidden-view-fallback-icon"
		/>
	);
};

export const InlineCardForbiddenView = ({
	url,
	icon,
	onClick,
	isSelected,
	testId = 'inline-card-forbidden-view',
	truncateInline,
	requestAccessContext,
	onAuthorise,
	context,
	showHoverPreview,
}: InlineCardForbiddenViewProps): JSX.Element => {
	const frameRef = React.useRef<HTMLSpanElement & null>(null);
	const [hasRequestAccessContextMessage] = React.useState(
		!!requestAccessContext?.callToActionMessageKey,
	);

	const handleRetry = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			event.preventDefault();
			event.stopPropagation();
			if (onAuthorise) {
				onAuthorise();
			} else {
				requestAccessContext?.action?.promise();
			}
		},
		[onAuthorise, requestAccessContext?.action],
	);

	const renderForbiddenAccessMessage = React.useCallback(() => {
		if (requestAccessContext?.callToActionMessageKey) {
			const { callToActionMessageKey } = requestAccessContext;
			return (
				<FormattedMessage {...messages[callToActionMessageKey]} values={{ product: context }} />
			);
		}
		return (
			<FormattedMessage {...messages.invalid_permissions}>
				{(formattedMessage) => <React.Fragment>{formattedMessage}</React.Fragment>}
			</FormattedMessage>
		);
	}, [context, requestAccessContext]);

	const renderActionButton = React.useCallback(() => {
		const accessType = requestAccessContext?.accessType;
		if (hasRequestAccessContextMessage) {
			const isDisabled = accessType === 'PENDING_REQUEST_EXISTS';
			return (
				<ActionButton
					isDisabled={isDisabled}
					onClick={handleRetry}
					testId="button-connect-other-account"
				>
					{renderForbiddenAccessMessage()}
				</ActionButton>
			);
		}
		if (onAuthorise) {
			if (fg('platform-linking-visual-refresh-inline-lozenge')) {
				return (
					<Pressable
						xcss={styles.actionButtonLozengeStyleNew}
						onClick={handleRetry}
						style={{ font: `inherit` }}
						testId="button-connect-other-account"
					>
						<InlineLozenge
							appearance="moved"
							{...(fg('platform-component-visual-refresh') ? { isBold: true } : undefined)}
						>
							{renderForbiddenAccessMessage()}
						</InlineLozenge>
					</Pressable>
				);
			}

			return (
				<LozengeWrapper>
					<Pressable
						xcss={styles.actionButtonLozengeStyleOld}
						onClick={handleRetry}
						testId="button-connect-other-account"
					>
						<Lozenge
							appearance="moved"
							{...(fg('platform-component-visual-refresh') ? { isBold: true } : undefined)}
						>
							{renderForbiddenAccessMessage()}
						</Lozenge>
					</Pressable>
				</LozengeWrapper>
			);
		}
		return null;
	}, [
		handleRetry,
		hasRequestAccessContextMessage,
		onAuthorise,
		renderForbiddenAccessMessage,
		requestAccessContext?.accessType,
	]);

	const content = (
		<Frame testId={testId} isSelected={isSelected} ref={frameRef} truncateInline={truncateInline}>
			<IconAndTitleLayout
				icon={icon ? icon : fallbackForbiddenIcon()}
				link={url}
				title={url}
				onClick={onClick}
				titleColor={token('color.text.subtle', N500)}
			/>
			{renderActionButton()}
		</Frame>
	);

	if (showHoverPreview) {
		return <HoverCard url={url}>{content}</HoverCard>;
	}

	return content;
};
