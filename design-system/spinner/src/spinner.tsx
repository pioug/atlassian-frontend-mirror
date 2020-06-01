/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/core';

import { DN500, DN900, N0, N500 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { presetSizes } from './constants';
import { Appearance, SpinnerProps } from './types';

const rotate = keyframes`
  to { transform: rotate(360deg); }
`;

// There are three parts to the load in animation:
// 1. Fade in
// 2. Accelerated spin
// 3. Stretch the spinner line
const loadIn = keyframes`
  from {
    transform: rotate(50deg);
    opacity: 0;
    stroke-dashoffset: 60;
  }
  to {
    transform: rotate(230deg);
    opacity: 1;
    stroke-dashoffset: 50;
  }
`;

function getStrokeColor({
  mode,
  appearance,
}: {
  mode: ThemeModes;
  appearance: Appearance;
}): string {
  if (mode === 'light') {
    return appearance === 'inherit' ? N500 : N0;
  }

  // Dark mode: colours provided by Jake Miller
  return appearance === 'inherit' ? DN900 : DN500;
}

export default React.memo(
  React.forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
    {
      testId,
      appearance = 'inherit',
      delay = 0,
      size: providedSize = 'medium',
    }: SpinnerProps,
    ref,
  ) {
    const size: number =
      typeof providedSize === 'number'
        ? providedSize
        : presetSizes[providedSize];

    return (
      <GlobalTheme.Consumer>
        {(tokens: GlobalThemeTokens) => {
          const strokeColor = getStrokeColor({
            mode: tokens.mode,
            appearance,
          });

          // The Spinner animation uses a combination of two
          // css animations on two separate elements.
          return (
            <svg
              focusable="false"
              height={size}
              width={size}
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              data-testid={testId}
              ref={ref}
              css={css`
                /* align better inline with text */
                vertical-align: middle;
                /* We are going to animate this in */
                opacity: 0;

                animation: ${loadIn} 1s ease-in-out;
                /* When the animation completes, stay at the last frame of the animation */
                animation-fill-mode: forwards;
                animation-delay: ${delay}ms;
              `}
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                css={css`
                  fill: none;
                  stroke: ${strokeColor};
                  stroke-width: 1.5;
                  stroke-linecap: round;
                  stroke-dasharray: 60;
                  stroke-dashoffset: inherit;
                  transform-origin: center;
                  animation: ${rotate} 0.86s infinite;
                  animation-delay: ${delay}ms;
                  animation-timing-function: cubic-bezier(0.4, 0.15, 0.6, 0.85);
                `}
              />
            </svg>
          );
        }}
      </GlobalTheme.Consumer>
    );
  }),
);
