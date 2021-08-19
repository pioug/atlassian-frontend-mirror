import React from 'react';
import { Wrapper } from './styled';

export interface FrameViewProps {
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A flag that determines whether the card needs a backgorund or not */
  withoutBackground?: boolean;
  withoutHover?: boolean;
  children?: React.ReactNode;
  link?: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  className?: string;
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
    const {
      isSelected,
      children,
      onClick,
      link,
      withoutBackground,
      withoutHover,
      testId,
      className,
    } = this.props;
    const isInteractive = Boolean(onClick);

    return (
      <Wrapper
        href={link}
        withoutBackground={withoutBackground}
        withoutHover={withoutHover}
        isSelected={isSelected}
        isInteractive={isInteractive}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onKeyPress={this.handleKeyPress}
        data-testid={testId}
        className={className}
      >
        {children}
      </Wrapper>
    );
  }
}
