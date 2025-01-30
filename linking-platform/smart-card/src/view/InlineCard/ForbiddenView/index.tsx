import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import ButtonOld from '@atlaskit/button';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LegacyLockIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { type RequestAccessContextProps } from '../../types';
import { ActionButton } from '../common/action-button';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { AKIconWrapper as AKIconWrapperOld } from '../Icon-emotion';
import { IconAndTitleLayout, LozengeWrapper as LozengeWrapperNew } from '../IconAndTitleLayout';
import { LozengeWrapperOldVisualRefresh } from '../IconAndTitleLayout/styled';
import { IconStyledButtonOldVisualRefresh } from '../styled';
import { IconStyledButton as IconStyledButtonOld } from '../styled-emotion';
import withFrameStyleControl from '../utils/withFrameStyleControl';

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

const iconWrapperStyles = xcss({ marginRight: 'space.negative.025' });

const fallbackForbiddenIcon = () => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return fg('platform-smart-card-icon-migration') ? (
			<Box as="span" xcss={iconWrapperStyles}>
				<LockLockedIcon
					label="error"
					color={token('color.icon.danger')}
					LEGACY_fallbackIcon={LegacyLockIcon}
					LEGACY_size="small"
					testId="forbidden-view-fallback-icon"
				/>
			</Box>
		) : (
			<AKIconWrapper>
				{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19497*/}
				<LegacyLockIcon
					label="error"
					size="small"
					primaryColor={token('color.icon.danger', R400)}
					testId="forbidden-view-fallback-icon"
				/>
			</AKIconWrapper>
		);
	} else {
		return fg('platform-smart-card-icon-migration') ? (
			<Box as="span" xcss={iconWrapperStyles}>
				<LockLockedIcon
					label="error"
					color={token('color.icon.danger')}
					LEGACY_fallbackIcon={LegacyLockIcon}
					LEGACY_size="small"
					testId="forbidden-view-fallback-icon"
				/>
			</Box>
		) : (
			<AKIconWrapperOld>
				{/*eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19497*/}
				<LegacyLockIcon
					label="error"
					size="small"
					primaryColor={token('color.icon.danger', R400)}
					testId="forbidden-view-fallback-icon"
				/>
			</AKIconWrapperOld>
		);
	}
};

export class InlineCardForbiddenView extends React.Component<InlineCardForbiddenViewProps> {
	private frameRef = React.createRef<HTMLSpanElement & null>();

	state = {
		hasRequestAccessContextMessage: !!this.props?.requestAccessContext?.callToActionMessageKey,
	};

	handleRetry = (event: React.MouseEvent<HTMLElement>) => {
		const { onAuthorise } = this.props;
		event.preventDefault();
		event.stopPropagation();
		if (onAuthorise) {
			onAuthorise();
		} else {
			this.props?.requestAccessContext?.action?.promise();
		}
	};

	renderForbiddenAccessMessage = () => {
		if (this.props?.requestAccessContext?.callToActionMessageKey) {
			const { callToActionMessageKey } = this.props.requestAccessContext;

			return (
				<FormattedMessage
					{...messages[callToActionMessageKey]}
					values={{ product: this.props.context }}
				/>
			);
		}
		return (
			<>
				<FormattedMessage {...messages.invalid_permissions}>
					{(formattedMessage) => {
						return <>{formattedMessage}</>;
					}}
				</FormattedMessage>
			</>
		);
	};

	renderActionButton = () => {
		const { onAuthorise } = this.props;

		const LozengeWrapper = fg('platform-linking-visual-refresh-v1')
			? LozengeWrapperNew
			: LozengeWrapperOldVisualRefresh;

		const Button = withFrameStyleControl(ButtonOld, this.frameRef);

		const accessType = this.props.requestAccessContext?.accessType;

		if (this.state.hasRequestAccessContextMessage) {
			if (fg('bandicoots-compiled-migration-smartcard')) {
				if (fg('platform-linking-visual-refresh-v1')) {
					const isDisabled = accessType === 'PENDING_REQUEST_EXISTS';
					return (
						<Button
							onClick={this.handleRetry}
							component={ActionButton}
							testId="button-connect-other-account"
							isDisabled={isDisabled}
						>
							{this.renderForbiddenAccessMessage()}
						</Button>
					);
				}

				return (
					<Button
						spacing="none"
						onClick={this.handleRetry}
						component={IconStyledButtonOldVisualRefresh}
						testId="button-connect-other-account"
						role="button"
						isDisabled={accessType === 'PENDING_REQUEST_EXISTS'}
					>
						{this.renderForbiddenAccessMessage()}
					</Button>
				);
			} else {
				return (
					<Button
						spacing="none"
						onClick={this.handleRetry}
						component={IconStyledButtonOld}
						testId="button-connect-other-account"
						role="button"
						isDisabled={accessType === 'PENDING_REQUEST_EXISTS'}
					>
						{this.renderForbiddenAccessMessage()}
					</Button>
				);
			}
		}

		if (onAuthorise) {
			if (fg('platform-linking-visual-refresh-v1')) {
				return (
					<LozengeWrapper>
						<Pressable
							xcss={actionButtonLozengeStyle}
							onClick={this.handleRetry}
							testId="button-connect-other-account"
						>
							<Lozenge appearance={'moved'}>{this.renderForbiddenAccessMessage()}</Lozenge>
						</Pressable>
					</LozengeWrapper>
				);
			}

			return (
				<Button
					spacing="none"
					onClick={this.handleRetry}
					appearance="subtle-link"
					testId="button-connect-other-account"
					role="button"
				>
					<LozengeWrapper>
						<Lozenge appearance={'moved'}>{this.renderForbiddenAccessMessage()}</Lozenge>
					</LozengeWrapper>
				</Button>
			);
		}
		return null;
	};

	render() {
		const {
			url,
			icon,
			onClick,
			isSelected,
			testId = 'inline-card-forbidden-view',
			truncateInline,
		} = this.props;

		const content = (
			<Frame
				testId={testId}
				isSelected={isSelected}
				ref={this.frameRef}
				truncateInline={truncateInline}
			>
				<IconAndTitleLayout
					icon={icon ? icon : fallbackForbiddenIcon()}
					link={url}
					title={url}
					onClick={onClick}
					titleColor={token('color.text.subtle', N500)}
				/>
				{this.renderActionButton()}
			</Frame>
		);

		if (this.props.showHoverPreview) {
			return <HoverCard url={url}>{content}</HoverCard>;
		}

		return content;
	}
}

const actionButtonLozengeStyle = xcss({
	backgroundColor: 'color.background.neutral.subtle',
	padding: 'space.0',
});
