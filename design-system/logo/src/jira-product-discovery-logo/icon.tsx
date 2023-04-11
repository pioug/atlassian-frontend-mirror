/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({
  appearance,
  size,
  iconGradientStart,
  iconGradientStop,
  iconColor,
}: LogoProps) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
  };
  // Will be fixed upon removal of deprecated iconGradientStart and
  // iconGradientStop props, or with React 18's useId() hook when we update.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  let id = uid({ iconGradientStart: iconGradientStop });

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
  }

  return `
  <svg
  height="32"
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M18.9987 15.6133C18.9987 15.6133 19.018 15.9933 19.018 16.518C19.018 18.4727 17.4333 20.0573 15.4787 20.0573C13.524 20.0573 11.9393 18.4727 11.9393 16.518C11.9393 14.5633 13.524 12.9787 15.4787 12.9787C16.0033 12.9787 16.3253 12.998 16.3253 12.998V6.08067C16.046 6.05801 15.764 6.04401 15.4787 6.04401C9.692 6.04401 5.00067 10.7353 5.00067 16.522C5.00067 22.3087 9.692 27 15.4787 27C21.2653 27 25.9567 22.3087 25.9567 16.522C25.9567 16.1887 25.9507 15.9573 25.9233 15.614H18.9987V15.6133Z"
    fill="url(#${id})"
  />
  <path
    d="M17.9233 5.01001C20.8313 5.79601 23.7393 5.79601 26.6473 5.01001C26.8573 4.95334 27.046 5.14201 26.9893 5.35201C26.2033 8.26001 26.2033 11.168 26.9893 14.076C27.046 14.286 26.8573 14.4747 26.6473 14.418C23.7393 13.632 20.8313 13.632 17.9233 14.418C17.7133 14.4747 17.5247 14.286 17.5813 14.076C18.3673 11.168 18.3673 8.26001 17.5813 5.35201C17.5247 5.14201 17.7133 4.95334 17.9233 5.01001Z"
    fill="${colors.iconColor}"
  />
  <defs>
    <linearGradient
      id="${id}"
      x1="14.178"
      y1="17.822"
      x2="21.4387"
      y2="10.5613"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="${colors.iconGradientStop}" />
      <stop offset="0.927" stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
    </linearGradient>
  </defs>
</svg>`;
};

/**
 * __Jira Product Discovery icon__
 *
 * The Jira Product Discovery icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraProductDiscoveryIcon = ({
  appearance,
  label = 'Jira Product Discovery',
  size = defaultLogoParams.size,
  testId,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      svg={svg({
        appearance,
        iconGradientStart,
        iconGradientStop,
        iconColor,
        label,
        size,
      })}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
