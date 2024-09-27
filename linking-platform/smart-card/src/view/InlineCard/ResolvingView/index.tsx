import React from 'react';
import { Frame } from '../Frame';
import Spinner from '@atlaskit/spinner';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { SpinnerWrapper } from './styled';
import { IconTitleWrapper, RightIconPositionWrapper } from '../IconAndTitleLayout/styled';
import { type InlinePreloaderStyle } from '../../types';

export interface InlineCardResolvingViewProps {
	/** The url to display */
	url: string;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	titleTextColor?: string;
	/** An optional placeholder displayed while the smart card is resolving. */
	resolvingPlaceholder?: string;
	/** Truncates the card to one line */
	truncateInline?: boolean;
}

export class InlineCardResolvingView extends React.Component<InlineCardResolvingViewProps> {
	render() {
		const {
			url,
			onClick,
			isSelected,
			inlinePreloaderStyle,
			testId = 'inline-card-resolving-view',
			titleTextColor,
			resolvingPlaceholder,
			truncateInline,
		} = this.props;
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
						<RightIconPositionWrapper>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<SpinnerWrapper className="inline-resolving-spinner">
								<Spinner size={14} />
							</SpinnerWrapper>
						</RightIconPositionWrapper>
					</IconTitleWrapper>
				</Frame>
			);
		} else {
			return (
				<Frame
					testId={testId}
					onClick={onClick}
					isSelected={isSelected}
					link={url}
					truncateInline={truncateInline}
				>
					<IconAndTitleLayout title={resolvingPlaceholder ?? url} titleTextColor={titleTextColor}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
						<SpinnerWrapper className="inline-resolving-spinner">
							<Spinner size={14} />
						</SpinnerWrapper>
					</IconAndTitleLayout>
				</Frame>
			);
		}
	}
}
