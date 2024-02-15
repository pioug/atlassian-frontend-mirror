/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { HoverCardContainer, popupContainerStyles } from '../styled';
import AIPrism from '../../common/ai-prism';
import { hoverCardClassName } from './HoverCardContent';
import type { ContentContainerProps } from '../types';

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  isAIEnabled = false,
  showPrism = false,
  testId,
  ...props
}) => {
  if (
    getBooleanFF('platform.linking-platform.smart-card.hover-card-ai-summaries')
  ) {
    const container = (
      <div
        className={hoverCardClassName}
        css={[
          HoverCardContainer,
          isAIEnabled && showPrism ? undefined : popupContainerStyles,
        ]}
        data-testid={testId}
        {...props}
      >
        {children}
      </div>
    );

    return isAIEnabled ? (
      <AIPrism isVisible={showPrism} testId={`${testId}-prism`}>
        {container}
      </AIPrism>
    ) : (
      container
    );
  }

  return (
    <div
      className={hoverCardClassName}
      css={HoverCardContainer}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

export default ContentContainer;
