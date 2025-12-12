/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { type InlinePreloaderStyle } from '../../types';
import { Frame } from '../Frame';
import { IconAndTitleLayout, IconTitleWrapper } from '../IconAndTitleLayout';
import { RightIconPositionWrapper } from '../IconAndTitleLayout/styled';

const styles = cssMap({
	spinnerWrapper: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '16px',
		width: '16px',
		font: token('font.body.small'),
	},
});

export interface InlineCardResolvingViewProps {
	inlinePreloaderStyle?: InlinePreloaderStyle;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** An optional placeholder displayed while the smart card is resolving. */
	resolvingPlaceholder?: string;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	titleTextColor?: string;
	/** Truncates the card to one line */
	truncateInline?: boolean;
	/** The url to display */
	url: string;
}

export const InlineCardResolvingView = ({
	url,
	onClick,
	isSelected,
	inlinePreloaderStyle,
	testId = 'inline-card-resolving-view',
	titleTextColor,
	resolvingPlaceholder,
	truncateInline,
}: InlineCardResolvingViewProps): JSX.Element => {
	const renderSpinner = React.useCallback(
		() => (
			<Box as="span" xcss={styles.spinnerWrapper}>
				<Spinner size={14} interactionName='smart-card-inline-card-spinner' />
			</Box>
		),
		[],
	);

	if (inlinePreloaderStyle === 'on-right-without-skeleton') {
		return (
			<Frame
				withoutBackground={true}
				testId={testId}
				onClick={onClick}
				isSelected={isSelected}
				truncateInline={truncateInline}
			>
				<IconTitleWrapper>
					{url}
					<RightIconPositionWrapper>{renderSpinner()}</RightIconPositionWrapper>
				</IconTitleWrapper>
			</Frame>
		);
	}
	return (
		<Frame
			testId={testId}
			onClick={onClick}
			isSelected={isSelected}
			link={url}
			truncateInline={truncateInline}
		>
			<IconAndTitleLayout
				icon={renderSpinner()}
				title={resolvingPlaceholder ?? url}
				titleTextColor={titleTextColor}
			/>
		</Frame>
	);
};
