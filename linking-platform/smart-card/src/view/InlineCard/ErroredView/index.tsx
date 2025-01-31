/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import ButtonOld from '@atlaskit/button';
import { cssMap, jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/utility/migration/error';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { HoverCard } from '../../HoverCard';
import { ActionButton } from '../common/action-button';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconStyledButtonOldVisualRefresh } from '../styled';
import withFrameStyleControl from '../utils/withFrameStyleControl';

import { InlineCardErroredViewOld } from './InlineCardErroredViewOld';

const styles = cssMap({
	iconWrapper: { marginRight: token('space.negative.025') },
});

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

const InlineCardErroredViewNew = ({
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
		const Button = withFrameStyleControl(ButtonOld, frameRef);
		return (
			onRetry &&
			(fg('platform-linking-visual-refresh-v1') ? (
				<Button component={ActionButton} onClick={handleRetry}>
					<FormattedMessage {...messages.try_again} />
				</Button>
			) : (
				<Button
					spacing="none"
					component={IconStyledButtonOldVisualRefresh}
					onClick={handleRetry}
					role="button"
				>
					<FormattedMessage {...messages.try_again} />
				</Button>
			))
		);
	}, [handleRetry, onRetry]);

	const defaultIcon = fg('platform-smart-card-icon-migration') ? (
		<Box as="span" xcss={styles.iconWrapper}>
			<ErrorIcon
				color={token('color.icon.danger')}
				label="error"
				LEGACY_size="small"
				testId="errored-view-default-icon"
			/>
		</Box>
	) : (
		<AKIconWrapper>
			<ErrorIcon
				label="error"
				LEGACY_size="small"
				color={token('color.icon.danger', R300)}
				testId="errored-view-default-icon"
			/>
		</AKIconWrapper>
	);

	const content = (
		<Frame testId={testId} isSelected={isSelected} ref={frameRef} truncateInline={truncateInline}>
			<IconAndTitleLayout
				icon={icon || defaultIcon}
				link={url}
				title={url}
				onClick={onClick}
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

export const InlineCardErroredView = (props: InlineCardErroredViewProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <InlineCardErroredViewNew {...props} />;
	}
	return <InlineCardErroredViewOld {...props} />;
};
