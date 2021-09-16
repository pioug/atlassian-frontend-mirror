import React from 'react';
import { Wrapper } from './styled';

export interface FrameViewProps {
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  isInteractive?: boolean;
  children?: React.ReactNode;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export class Frame extends React.Component<FrameViewProps> {
  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    }
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    }
  };

  // prevent default on mousedown to avoid inline card losing focus
  handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  render() {
    const { isSelected, children, onClick, testId } = this.props;
    const isInteractive = Boolean(onClick);

    return (
      <Wrapper
        isSelected={isSelected}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onKeyPress={this.handleKeyPress}
        data-testid={testId}
      >
        {children}
      </Wrapper>
    );
  }
}
