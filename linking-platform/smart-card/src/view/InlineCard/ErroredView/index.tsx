/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { ActionButton } from '../common/action-button';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

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

const fallbackIcon = () => {
	return (
		<ErrorIcon
			color={token('color.icon.danger')}
			label="error"
			LEGACY_size="small"
			testId="errored-view-default-icon"
		/>
	);
};

export const InlineCardErroredView = ({
	url,
	onClick,
	isSelected,
	testId = 'inline-card-errored-view',
	icon,
	message,
	onRetry,
	truncateInline,
	showHoverPreview,
}: InlineCardErroredViewProps) => {
	const frameRef = React.useRef<HTMLSpanElement & null>(null);
	const hashAction = !!onRetry;

	const handleRetry = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if (onRetry) {
				event.preventDefault();
				event.stopPropagation();
				onRetry();
			}
		},
		[onRetry],
	);

	const renderActionButton = React.useCallback(() => {
		return (
			onRetry && (
				<ActionButton onClick={handleRetry}>
					<FormattedMessage {...messages.try_again} />
				</ActionButton>
			)
		);
	}, [handleRetry, onRetry]);

	const content = (
		<Frame
			link={hashAction ? undefined : url}
			onClick={hashAction ? undefined : onClick}
			isSelected={isSelected}
			ref={frameRef}
			testId={testId}
			truncateInline={truncateInline}
		>
			<IconAndTitleLayout
				icon={icon || fallbackIcon()}
				link={hashAction ? url : undefined}
				title={url}
				onClick={hashAction ? onClick : undefined}
				rightSide={message}
			/>
			{renderActionButton()}
		</Frame>
	);

	if (showHoverPreview) {
		return <HoverCard url={url}>{content}</HoverCard>;
	}

	return content;
};
