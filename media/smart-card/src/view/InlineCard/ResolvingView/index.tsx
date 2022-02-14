import React from 'react';
import { Frame } from '../Frame';
import Spinner from '@atlaskit/spinner';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { SpinnerWrapper } from './styled';
import {
  IconTitleWrapper,
  RightIconPositionWrapper,
} from '../IconAndTitleLayout/styled';
import { InlinePreloaderStyle } from '../../types';

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
  withoutHover?: boolean;
}

export class InlineCardResolvingView extends React.Component<
  InlineCardResolvingViewProps
> {
  render() {
    const {
      url,
      onClick,
      isSelected,
      inlinePreloaderStyle,
      testId = 'inline-card-resolving-view',
      titleTextColor,
      withoutHover,
    } = this.props;
    if (inlinePreloaderStyle === 'on-right-without-skeleton') {
      return (
        <Frame
          withoutBackground={true}
          withoutHover={withoutHover}
          testId={testId}
          onClick={onClick}
          isSelected={isSelected}
        >
          <IconTitleWrapper>
            {url}
            <RightIconPositionWrapper>
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
          withoutHover={withoutHover}
        >
          <IconAndTitleLayout title={url} titleTextColor={titleTextColor}>
            <SpinnerWrapper className="inline-resolving-spinner">
              <Spinner size={14} />
            </SpinnerWrapper>
          </IconAndTitleLayout>
        </Frame>
      );
    }
  }
}
