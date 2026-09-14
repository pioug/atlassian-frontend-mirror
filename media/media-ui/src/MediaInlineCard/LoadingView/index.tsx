import React from 'react';

import Spinner from '@atlaskit/spinner/spinner';

import { type InlinePreloaderStyle } from '../../types';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconTitleWrapper } from '../IconAndTitleLayout/icon-title-wrapper';
import { RightIconPositionWrapper } from '../IconAndTitleLayout/right-icon-position-wrapper';
import { SpinnerWrapper } from './styled';

export interface MediaInlineCardLoadingViewProps {
	/** The file name to display */
	message: string;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	innerRef?: React.Ref<HTMLSpanElement>;
	withoutHover?: boolean;
}

export class MediaInlineCardLoadingView extends React.Component<MediaInlineCardLoadingViewProps> {
	render(): React.JSX.Element {
		const {
			message,
			onClick,
			isSelected,
			inlinePreloaderStyle,
			innerRef,
			testId = 'media-inline-card-loading-view',
		} = this.props;

		if (inlinePreloaderStyle === 'on-right-without-skeleton') {
			return (
				<Frame innerRef={innerRef} testId={testId} onClick={onClick} isSelected={isSelected}>
					<IconTitleWrapper>
						{message}
						<RightIconPositionWrapper>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<SpinnerWrapper className="inline-loading-spinner">
								<Spinner size={14} interactionName="media-inline-card-loading-view" />
							</SpinnerWrapper>
						</RightIconPositionWrapper>
					</IconTitleWrapper>
				</Frame>
			);
		} else {
			return (
				<Frame innerRef={innerRef} testId={testId} onClick={onClick} isSelected={isSelected}>
					<IconAndTitleLayout title={message}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<SpinnerWrapper className="inline-loading-spinner">
							<Spinner size={14} interactionName="media-inline-card-loading-view" />
						</SpinnerWrapper>
					</IconAndTitleLayout>
				</Frame>
			);
		}
	}
}
