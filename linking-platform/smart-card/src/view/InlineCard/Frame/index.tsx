import React, { MouseEvent, useCallback } from 'react';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { WrapperAnchor, WrapperSpan } from './styled';

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
}

export const Frame: React.FC<FrameViewProps> = (props) => {
  const {
    isSelected,
    children,
    onClick,
    link,
    withoutBackground,
    testId,
    className,
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
  const isInteractive = Boolean(onClick);

  // Depending on whenever Frame was given onClick or link itself we display span or anchor elements
  const Wrapper = link || onClick ? WrapperAnchor : WrapperSpan;

  // TODO Theming doesn't work right now in editor. Required React context does not trickle down atm.
  //  It will be worked as part of https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-154
  return (
    <Wrapper
      theme={useGlobalTheme()}
      href={link}
      withoutBackground={withoutBackground}
      isSelected={isSelected}
      isInteractive={isInteractive}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      data-testid={testId}
      className={className}
    >
      {children}
    </Wrapper>
  );
};
