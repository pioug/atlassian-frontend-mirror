/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/react';

import { DN500, DN900, N0, N500 } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { presetSizes } from './constants';
import { Appearance, SpinnerProps } from './types';

/**
 * Returns the appropriate circle stroke color.
 */
function getStrokeColor({
  mode,
  appearance,
}: {
  mode: ThemeModes;
  appearance: Appearance;
}): string {
  if (mode === 'light') {
    return appearance === 'inherit'
      ? token('color.text.subtle', N500)
      : token('color.text.inverse', N0);
  }

  return appearance === 'inherit'
    ? token('color.text.subtle', DN900)
    : token('color.text.inverse', DN500);
}

const rotate = keyframes({
  to: { transform: 'rotate(360deg)' },
});

const rotateStyles = css({
  animation: `${rotate} 0.86s infinite`,
  animationTimingFunction: 'cubic-bezier(0.4, 0.15, 0.6, 0.85)',
  transformOrigin: 'center',
});

/**
 * There are three parts to the load in animation:
 * 1. Fade in
 * 2. Accelerated spin
 * 3. Stretch the spinner line
 */
const loadIn = keyframes({
  from: {
    transform: 'rotate(50deg)',
    opacity: 0,
    strokeDashoffset: 60,
  },
  to: {
    transform: 'rotate(230deg)',
    opacity: 1,
    strokeDashoffset: 50,
  },
});

const loadInStyles = css({
  animation: `${loadIn} 1s ease-in-out`,
  /**
   * When the animation completes, stay at the last frame of the animation.
   */
  animationFillMode: 'forwards',
  /**
   * We are going to animate this in.
   */
  opacity: 0,
});

const wrapperStyles = css({
  display: 'inline-flex',
  /**
   * Align better inline with text.
   */
  verticalAlign: 'middle',
});

const circleStyles = css({
  fill: 'none',
  strokeDasharray: 60,
  strokeDashoffset: 'inherit',
  strokeLinecap: 'round',
  strokeWidth: 1.5,
  '@media screen and (forced-colors: active)': {
    filter: 'grayscale(100%)',
    stroke: 'CanvasText',
  },
});

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

    const animationDelay = `${delay}ms`;

    const { mode } = useGlobalTheme();
    const stroke = getStrokeColor({
      mode,
      appearance,
    });

    /**
     * The Spinner animation uses a combination of two
     * css animations on two separate elements.
     */
    return (
      <span
        /**
         * This span exists to off-load animations from the circle element,
         * which were causing performance issues (style recalculations)
         * on Safari and older versions of Chrome.
         *
         * This can be removed and styles placed back on the circle element once
         * Safari fixes this bug and off-loads rendering to the GPU from the CPU.
         */
        css={[wrapperStyles, rotateStyles]}
        data-testid={testId && `${testId}-wrapper`}
        style={{ animationDelay, width: size, height: size }}
      >
        <svg
          height={size}
          width={size}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          data-testid={testId}
          ref={ref}
          css={loadInStyles}
          style={{ animationDelay }}
        >
          <circle cx="8" cy="8" r="7" css={circleStyles} style={{ stroke }} />
        </svg>
      </span>
    );
  }),
);
