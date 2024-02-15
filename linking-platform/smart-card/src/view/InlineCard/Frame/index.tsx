import React, { MouseEvent, useCallback, forwardRef } from 'react';
import { WrapperAnchor, WrapperSpan } from './styled';
import { useMouseDownEvent } from '../../../state/analytics/useLinkClicked';

export interface FrameViewProps {
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A flag that determines whether the card needs a backgorund or not */
  withoutBackground?: boolean;
  children?: React.ReactNode;
  link?: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  className?: string;
  /** A flag that determines whether a card is in hover state in edit mode. */
  isHovered?: boolean;
}

export const Frame = forwardRef<HTMLSpanElement & null, FrameViewProps>(
  (props, ref) => {
    const {
      isSelected,
      children,
      onClick,
      link,
      withoutBackground,
      testId,
      className,
      isHovered,
    } = props;

    const handleClick = useCallback(
      (event: MouseEvent) => {
        if (onClick) {
          event.preventDefault();
          event.stopPropagation();
          onClick(event);
        }
      },
      [onClick],
    );

    const handleKeyPress = useCallback(
      (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (event.key !== ' ' && event.key !== 'Enter') {
          return;
        }
        if (onClick) {
          event.preventDefault();
          event.stopPropagation();
          onClick(event);
        }
      },
      [onClick],
    );

    const handleMouseDown = useMouseDownEvent();

    const isInteractive = Boolean(onClick);

    // Depending on whenever Frame was given onClick or link itself we display span or anchor elements
    const Wrapper = link || onClick ? WrapperAnchor : WrapperSpan;

    return (
      <Wrapper
        href={link}
        withoutBackground={withoutBackground}
        isSelected={isSelected}
        isInteractive={isInteractive}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onKeyPress={handleKeyPress}
        data-testid={testId}
        className={className}
        ref={ref}
        isHovered={isHovered}
      >
        {children}
      </Wrapper>
    );
  },
);
