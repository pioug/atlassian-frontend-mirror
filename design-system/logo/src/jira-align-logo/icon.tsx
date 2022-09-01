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
    id = `jiraIcon-${appearance}`;
  }

  return `
  <svg height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
   <defs>
      <linearGradient id="${id}-1" x1="15.1552" y1="20.5458" x2="16.7055" y2="12.6394" gradientUnits="userSpaceOnUse">
        <stop offset="0.15" stop-color="${colors.iconGradientStart}"  ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient id="${id}-2" x1="18.3249" y1="10.8472" x2="16.7745" y2="18.7536" gradientUnits="userSpaceOnUse">
        <stop offset="0.15" stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <path fill="url(#${id}-1)" d="M6.93411 5.78784C6.93411 9.51693 9.94886 12.5581 13.6455 12.5581H19.8545V18.8578H26.5659V6.91019C26.5659 6.33091 26.0993 5.82405 25.5251 5.82405L6.93411 5.78784Z" />
    <path fill="url(#${id}-2)" d="M26.53 25.5918C26.53 21.8627 23.5152 18.8577 19.8186 18.8577H13.6455V12.5581H6.93411V24.5057C6.93411 25.085 7.40068 25.5918 7.97492 25.5918H26.53Z" />
  </svg>`;
};

/**
 * __Jira Align icon__
 *
 * The Jira Align icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraAlignIcon = ({
  appearance,
  label = 'Jira Align',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
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
