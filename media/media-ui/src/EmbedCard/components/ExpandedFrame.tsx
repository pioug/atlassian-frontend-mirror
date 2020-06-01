import React, { FC } from 'react';
import {
  className,
  LinkWrapper,
  Wrapper,
  Header,
  IconWrapper,
  TextWrapper,
  Content,
} from './styled';

export interface ExpandedFrameProps {
  isPlaceholder?: boolean;
  href?: string;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  children?: React.ReactNode;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** will show the frame regardless of user interaction */
  isFrameVisible?: boolean;
  /** A flag that determines whether the frame is visible. */
  isVisible?: boolean;
  /** The optional click handler */
  onClick?: () => void;
  /** For testing purposes only */
  testId?: string;
}

export const ExpandedFrame: FC<ExpandedFrameProps> = ({
  isPlaceholder = false,
  children,
  onClick,
  icon,
  text,
  isSelected,
  isFrameVisible,
  isVisible,
  href,
  minWidth,
  maxWidth,
  testId,
}) => {
  const isInteractive = () =>
    !isPlaceholder && (Boolean(href) || Boolean(onClick));
  const handleClick = (event: any) => {
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    }
  };
  const renderHeader = () => (
    <Header className="embed-header">
      <IconWrapper isPlaceholder={isPlaceholder}>
        {!isPlaceholder && icon}
      </IconWrapper>
      <TextWrapper isPlaceholder={isPlaceholder}>
        {!isPlaceholder && text}
      </TextWrapper>
    </Header>
  );
  const renderContent = () => (
    <Content isInteractive={isInteractive()}>{children}</Content>
  );

  if (!isPlaceholder && href) {
    return (
      <LinkWrapper
        className={className}
        isInteractive={isInteractive()}
        isSelected={isSelected}
        isFrameVisible={isFrameVisible}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={handleClick}
        isVisible={isVisible}
        data-testid={testId}
      >
        {renderHeader()}
        {renderContent()}
      </LinkWrapper>
    );
  } else {
    return (
      <Wrapper
        className={className}
        isInteractive={isInteractive()}
        isSelected={isSelected}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={handleClick}
        isVisible={isVisible}
        data-testid={testId}
      >
        {renderHeader()}
        {renderContent()}
      </Wrapper>
    );
  }
};
