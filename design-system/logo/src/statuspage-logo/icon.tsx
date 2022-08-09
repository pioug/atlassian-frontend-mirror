/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({
  appearance,
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
    id = `statuspageIcon-${appearance}`;
  }

  return `
  <svg viewBox="0 0 32 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient id="${id}" x1="50%" x2="50%" y1="82.77%" y2="10.134%">
        <stop offset="0%" stop-color="${colors.iconGradientStop}" />
        <stop offset="82%" stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
      </linearGradient>
    </defs>
    <g fill-rule="evenodd">
      <circle cx="16" cy="19.423" r="5.538" fill="url(#${id})" fill-rule="nonzero"/>
      <path fill="${
        colors.iconColor
      }" fill-rule="nonzero" d="M4.14318325,11.970217 L7.17443341,15.5164923 C7.40520779,15.7738906 7.80165918,15.8034375 8.06900618,15.5831636 C12.9601954,11.2622319 19.0323494,11.2622319 23.9235386,15.5831636 C24.1908857,15.8034375 24.5873371,15.7738906 24.8181114,15.5164923 L27.8525794,11.970217 C28.0663737,11.714892 28.04536,11.3403265 27.8043112,11.1098404 C20.6927794,4.96338652 11.2997654,4.96338652 4.20110522,11.1098404 C3.95712825,11.3377486 3.93190106,11.7124749 4.14318325,11.970217 Z"/>
    </g>
  </svg>`;
};

/**
 * __Statuspage icon__
 *
 * The Statuspage icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const StatuspageIcon = ({
  appearance,
  label = 'Statuspage',
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
