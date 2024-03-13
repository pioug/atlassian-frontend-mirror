/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { HoverCardContainer, popupContainerStyles } from '../styled';
import AIPrism from '../../common/ai-prism';
import { hoverCardClassName } from './HoverCardContent';
import type { ContentContainerProps } from '../types';
import { useAISummary } from '../../../state/hooks/use-ai-summary';

const ConnectedAIPrismContainer = ({
  children,
  isAIEnabled = false,
  testId,
  url,
  ...props
}: ContentContainerProps) => {
  const {
    state: { status },
  } = useAISummary({ url });

  const [showPrism, setShowPrism] = useState(status === 'loading');

  useEffect(() => {
    setShowPrism(status === 'loading');
  }, [status]);

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
};

const ContentContainer = ({
  children,
  isAIEnabled = false,
  testId,
  url,
  ...props
}: ContentContainerProps) => {
  if (
    getBooleanFF('platform.linking-platform.smart-card.hover-card-ai-summaries')
  ) {
    return (
      <ConnectedAIPrismContainer
        isAIEnabled={isAIEnabled}
        url={url}
        testId={testId}
        {...props}
      >
        {children}
      </ConnectedAIPrismContainer>
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
