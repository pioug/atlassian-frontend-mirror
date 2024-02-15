/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { AI_BORDER_PALETTE, INNER_BORDER_RADIUS } from './constants';
import AIGlowingBorder from './ai-glowing-border';

import type { AIPrismProps } from './types';

const contentStyles = css({
  backgroundColor: token('elevation.surface.raised', 'white'),
  borderRadius: INNER_BORDER_RADIUS,
});

const AIPrism: React.FC<AIPrismProps> = ({
  children,
  isGlowing = true,
  isMoving = true,
  isVisible,
  testId,
}) => {
  const { colorMode = 'light' } = useThemeObserver();

  return (
    <AIGlowingBorder
      additionalCss={{
        animatedSvgContainer: css({ opacity: isVisible ? 1 : 0 }),
      }}
      palette={AI_BORDER_PALETTE[colorMode] ?? AI_BORDER_PALETTE.light}
      isGlowing={isGlowing}
      isMoving={isMoving}
      testId={testId}
    >
      <div css={contentStyles}>{children}</div>
    </AIGlowingBorder>
  );
};

export default AIPrism;
