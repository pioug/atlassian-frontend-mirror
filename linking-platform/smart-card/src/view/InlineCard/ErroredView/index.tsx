import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import ButtonOld from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/utility/migration/error';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { ActionButton } from '../common/action-button';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { AKIconWrapper as AKIconWrapperOld } from '../Icon-emotion';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconStyledButtonOldVisualRefresh } from '../styled';
import { IconStyledButton as IconStyledButtonOld } from '../styled-emotion';
import withFrameStyleControl from '../utils/withFrameStyleControl';

export interface InlineCardErroredViewProps {
	/** The url to display */
	url: string;
	/** The error message to display */
	message: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** What to do when a user clicks "Try again" button */
	onRetry?: () => void;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/* Icon to be provided to show this error state */
	icon?: React.ReactNode;
	/** Enables showing a custom preview on hover of link */
	showHoverPreview?: boolean;
	/** Truncates the card to one line */
	truncateInline?: boolean;
}

const iconWrapperStyles = xcss({ marginRight: 'space.negative.025' });

export class InlineCardErroredView extends React.Component<InlineCardErroredViewProps> {
	private frameRef = React.createRef<HTMLSpanElement & null>();

	handleRetry = (event: React.MouseEvent<HTMLElement>) => {
		const { onRetry } = this.props;
		if (onRetry) {
			event.preventDefault();
			event.stopPropagation();
			onRetry();
		}
	};

	renderActionButton = () => {
		const { onRetry } = this.props;

		const Button = withFrameStyleControl(ButtonOld, this.frameRef);

		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				onRetry && (
					<Button component={ActionButton} onClick={this.handleRetry}>
						<FormattedMessage {...messages.try_again} />
					</Button>
				)
			);
		}

		return (
			onRetry && (
				<Button
					spacing="none"
					component={
						fg('bandicoots-compiled-migration-smartcard')
							? IconStyledButtonOldVisualRefresh
							: IconStyledButtonOld
					}
					onClick={this.handleRetry}
					role="button"
				>
					<FormattedMessage {...messages.try_again} />
				</Button>
			)
		);
	};

	render() {
		const {
			url,
			onClick,
			isSelected,
			testId = 'inline-card-errored-view',
			icon,
			message,
			truncateInline,
		} = this.props;

		const Wrapper = fg('bandicoots-compiled-migration-smartcard')
			? AKIconWrapper
			: AKIconWrapperOld;

		const content = (
			<Frame
				testId={testId}
				isSelected={isSelected}
				ref={this.frameRef}
				truncateInline={truncateInline}
			>
				<IconAndTitleLayout
					icon={
						icon ||
						(fg('platform-smart-card-icon-migration') ? (
							<Box as="span" xcss={iconWrapperStyles}>
								<ErrorIcon
									color={token('color.icon.danger')}
									label="error"
									LEGACY_size="small"
									testId="errored-view-default-icon"
								/>
							</Box>
						) : (
							<Wrapper>
								<ErrorIcon
									label="error"
									LEGACY_size="small"
									color={token('color.icon.danger', R300)}
									testId="errored-view-default-icon"
								/>
							</Wrapper>
						))
					}
					link={url}
					title={url}
					onClick={onClick}
					rightSide={message}
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
