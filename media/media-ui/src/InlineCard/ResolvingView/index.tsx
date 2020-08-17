import React from 'react';
import { Frame } from '../Frame';
import Spinner from '@atlaskit/spinner';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { SpinnerWrapper } from './styled';

export interface InlineCardResolvingViewProps {
  /** The url to display */
  url: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export class InlineCardResolvingView extends React.Component<
  InlineCardResolvingViewProps
> {
  render() {
    const {
      url,
      onClick,
      isSelected,
      testId = 'inline-card-resolving-view',
    } = this.props;
    return (
      <Frame testId={testId} onClick={onClick} isSelected={isSelected}>
        <IconAndTitleLayout title={url}>
          <SpinnerWrapper className="inline-resolving-spinner">
            <Spinner size={14} />
          </SpinnerWrapper>
        </IconAndTitleLayout>
      </Frame>
    );
  }
}
