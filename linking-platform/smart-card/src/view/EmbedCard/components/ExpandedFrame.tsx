import React, { FC, MouseEvent } from 'react';
import {
  className,
  LinkWrapper,
  Wrapper,
  Header,
  IconWrapper,
  TextWrapper,
  TooltipWrapper,
  Content,
} from './styled';
import { handleClickCommon } from '../../BlockCard/utils/handlers';
import { useMouseDownEvent } from '../../../state/analytics/useLinkClicked';
import { FrameStyle } from '../types';
import Tooltip from '@atlaskit/tooltip';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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
  /** A prop that determines the style of a frame: whether to show it, hide it or only show it when a user hovers over embed */
  frameStyle?: FrameStyle;
  /** The optional click handler */
  onClick?: (evt: React.MouseEvent) => void;
  /** For testing purposes only */
  testId?: string;
  /** If dimensions of the card are to be inherited from the parent */
  inheritDimensions?: boolean;
  /** To enable scrolling in use cases where the content will not have it's own scrollbar */
  allowScrollBar?: boolean;
}

export const ExpandedFrame: FC<ExpandedFrameProps> = ({
  isPlaceholder = false,
  children,
  onClick,
  icon,
  text,
  isSelected,
  frameStyle = 'showOnHover',
  href,
  minWidth,
  maxWidth,
  testId = 'expanded-frame',
  inheritDimensions,
  allowScrollBar = false,
}) => {
  const isInteractive = () =>
    !isPlaceholder && (Boolean(href) || Boolean(onClick));
  const handleClick = (event: MouseEvent) => handleClickCommon(event, onClick);
  const handleMouseDown = useMouseDownEvent();

  const renderHeaderOld = () => (
    <Header className="embed-header" frameStyle={frameStyle}>
      <IconWrapper isPlaceholder={isPlaceholder}>
        {!isPlaceholder && icon}
      </IconWrapper>
      <TextWrapper isPlaceholder={isPlaceholder}>
        {!isPlaceholder && (
          <a href={href} onClick={handleClick} onMouseDown={handleMouseDown}>
            {text}
          </a>
        )}
      </TextWrapper>
    </Header>
  );

  const renderHeader = () => (
    <Header className="embed-header" frameStyle={frameStyle}>
      <IconWrapper isPlaceholder={isPlaceholder}>
        {!isPlaceholder && icon}
      </IconWrapper>
      <TooltipWrapper>
        <Tooltip content={text} hideTooltipOnMouseDown>
          <TextWrapper isPlaceholder={isPlaceholder}>
            {!isPlaceholder && (
              <a
                href={href}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
              >
                {text}
              </a>
            )}
          </TextWrapper>
        </Tooltip>
      </TooltipWrapper>
    </Header>
  );

  const renderContent = () => (
    <Content
      data-testid="embed-content-wrapper"
      allowScrollBar={allowScrollBar}
      isInteractive={isInteractive()}
      frameStyle={frameStyle}
    >
      {children}
    </Content>
  );
  if (!isPlaceholder && href) {
    return (
      <LinkWrapper
        className={className}
        isInteractive={isInteractive()}
        isSelected={isSelected}
        frameStyle={frameStyle}
        minWidth={minWidth}
        maxWidth={maxWidth}
        data-testid={testId}
        data-trello-do-not-use-override={testId}
        // Due to limitations of testing library, we can't assert ::after
        data-is-selected={isSelected}
        inheritDimensions={inheritDimensions}
      >
        {getBooleanFF(
          'platform.linking-platform.smart-card.embed-card-header-tooltip',
        )
          ? renderHeader()
          : renderHeaderOld()}
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
        frameStyle={frameStyle}
        maxWidth={maxWidth}
        data-testid={testId}
        data-trello-do-not-use-override={testId}
        data-is-selected={isSelected}
        data-wrapper-type="default"
        data-is-interactive={isInteractive()}
      >
        {getBooleanFF(
          'platform.linking-platform.smart-card.embed-card-header-tooltip',
        )
          ? renderHeader()
          : renderHeaderOld()}
        {renderContent()}
      </Wrapper>
    );
  }
};
