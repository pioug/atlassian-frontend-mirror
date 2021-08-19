/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/core';

import { DN500, DN900, N0, N500 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

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
    return appearance === 'inherit'
      ? token('color.text.mediumEmphasis', N500)
      : token('color.text.onBold', N0);
  }

  return appearance === 'inherit'
    ? token('color.text.mediumEmphasis', DN900)
    : token('color.text.onBold', DN500);
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
        {(tokens) => {
          const strokeColor = getStrokeColor({
            mode: tokens.mode,
            appearance,
          });

          // The Spinner animation uses a combination of two
          // css animations on two separate elements.
          return (
            <span
              /* This span exists to off-load animations from the circle element,
               which were causing performance issues (style recalculations) on Safari and older versions of Chrome.
               This can be removed and styles placed back on the circle element once Safari fixes this bug and off-loads rendering to the GPU from the CPU.
               */
              css={css`
                transform-origin: center;
                animation: ${rotate} 0.86s infinite;
                animation-delay: ${delay}ms;
                animation-timing-function: cubic-bezier(0.4, 0.15, 0.6, 0.85);
                height: ${size}px;
                width: ${size}px;
                display: inline-flex;
                /* align better inline with text */
                vertical-align: middle;
              `}
              data-testid={testId && `${testId}-wrapper`}
            >
              <svg
                height={size}
                width={size}
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                data-testid={testId}
                ref={ref}
                css={css`
                  /* We are going to animate this in */
                  opacity: 0;
                  animation: ${loadIn} 1s ease-in-out;
                  /* When the animation completes, stay at the last frame of the animation */
                  animation-fill-mode: forwards;
                  animation-delay: ${delay}ms;
                  fill: none;
                  stroke: ${strokeColor};
                  stroke-width: 1.5;
                  stroke-linecap: round;
                  stroke-dasharray: 60;
                  stroke-dashoffset: inherit;
                  @media screen and (forced-colors: active) {
                    filter: grayscale(100%);
                    stroke: CanvasText;
                  }
                `}
              >
                <circle cx="8" cy="8" r="7" />
              </svg>
            </span>
          );
        }}
      </GlobalTheme.Consumer>
    );
  }),
);
