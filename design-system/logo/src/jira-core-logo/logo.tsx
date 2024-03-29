/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import Wrapper from '../wrapper';

const svg = ({ iconGradientStart, iconGradientStop }: LogoProps) => {
  // Will be fixed upon removal of deprecated iconGradientStart and
  // iconGradientStop props, or with React 18's useId() hook when we update.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  let id = uid({ iconGradientStart: iconGradientStop });
  return `
  <svg viewBox="0 0 123 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="17.1933086%" y1="20.0326493%" x2="88.2434944%" y2="53.9179104%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="17%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="evenodd">
      <path d="M12.4602727,20.1745455 C12.4602727,24.4964247 16.0514375,28 20.4813636,28 L20.4813636,28 L20.4813636,12.4072727 L12.4602727,17.7672727 L12.4602727,20.1745455 Z" fill="url(#${id})" fill-rule="nonzero"></path>
      <path d="M20.4813636,12.4072727 L20.4813636,5.16727273 C20.4805706,4.73654063 20.2359584,4.34146943 19.8455373,4.14035499 C19.4551163,3.93924054 18.9827587,3.96498483 18.6177273,4.20727273 L0,16.6072727 C2.49141839,20.1791399 7.47849106,21.1053472 11.1408182,18.6763636 L20.4813636,12.4072727 Z" fill="currentColor" fill-rule="nonzero"></path>
      <path d="M33.07,18.956 C33.07,20.646 32.394,21.842 30.418,21.842 C29.56,21.842 28.702,21.686 28,21.4 L28,23.662 C28.65,23.896 29.586,24.104 30.808,24.104 C34.032,24.104 35.41,21.946 35.41,18.8 L35.41,6.918 L33.07,6.918 L33.07,18.956 Z M38.894,7.568 C38.894,8.556 39.544,9.128 40.454,9.128 C41.364,9.128 42.014,8.556 42.014,7.568 C42.014,6.58 41.364,6.008 40.454,6.008 C39.544,6.008 38.894,6.58 38.894,7.568 Z M39.31,24 L41.546,24 L41.546,11 L39.31,11 L39.31,24 Z M44.926,24 L47.11,24 L47.11,16.33 C47.11,13.574 48.852,12.716 51.712,13.002 L51.712,10.818 C49.164,10.662 47.864,11.754 47.11,13.288 L47.11,11 L44.926,11 L44.926,24 Z M62.45,24 L62.45,21.66 C61.618,23.376 60.058,24.26 58.056,24.26 C54.598,24.26 52.856,21.322 52.856,17.5 C52.856,13.834 54.676,10.74 58.316,10.74 C60.214,10.74 61.67,11.598 62.45,13.288 L62.45,11 L64.686,11 L64.686,24 L62.45,24 Z M55.092,17.5 C55.092,20.62 56.34,22.18 58.654,22.18 C60.656,22.18 62.45,20.906 62.45,18.02 L62.45,16.98 C62.45,14.094 60.812,12.82 58.914,12.82 C56.392,12.82 55.092,14.484 55.092,17.5 Z M85.018,20.984 C83.77,21.608 82.366,22.024 80.572,22.024 C76.516,22.024 74.046,19.424 74.046,15.498 C74.046,11.572 76.438,8.92 80.442,8.92 C82.418,8.92 83.77,9.336 84.992,10.116 L84.992,7.854 C83.77,6.97 82.106,6.658 80.442,6.658 C74.878,6.658 71.706,10.298 71.706,15.498 C71.706,20.88 74.878,24.26 80.494,24.26 C82.262,24.26 83.952,23.948 85.018,23.246 L85.018,20.984 Z M93.624,24.26 C89.724,24.26 87.436,21.374 87.436,17.474 C87.436,13.574 89.724,10.74 93.624,10.74 C97.498,10.74 99.76,13.574 99.76,17.474 C99.76,21.374 97.498,24.26 93.624,24.26 Z M93.624,12.82 C90.842,12.82 89.62,15.004 89.62,17.474 C89.62,19.944 90.842,22.18 93.624,22.18 C96.38,22.18 97.576,19.944 97.576,17.474 C97.576,15.004 96.38,12.82 93.624,12.82 Z M102.36,24 L104.544,24 L104.544,16.33 C104.544,13.574 106.286,12.716 109.146,13.002 L109.146,10.818 C106.598,10.662 105.298,11.754 104.544,13.288 L104.544,11 L102.36,11 L102.36,24 Z M121.314,23.48 C120.248,24.052 118.61,24.26 117.284,24.26 C112.422,24.26 110.29,21.452 110.29,17.474 C110.29,13.548 112.474,10.74 116.426,10.74 C120.43,10.74 122.042,13.522 122.042,17.474 L122.042,18.488 L112.552,18.488 C112.864,20.698 114.294,22.128 117.362,22.128 C118.87,22.128 120.144,21.842 121.314,21.426 L121.314,23.48 Z M116.322,12.768 C113.956,12.768 112.76,14.302 112.526,16.564 L119.78,16.564 C119.65,14.146 118.558,12.768 116.322,12.768 Z" fill="inherit"></path>
    </g>
  </svg>`;
};

/**
 * @deprecated JiraCoreLogo will be removed from @atlaskit/logo in the next major release. Please use JiraWorkManagementLogo instead.
 */
export const JiraCoreLogo = ({
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  label = 'Jira Core',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    warnOnce(
      'JiraCoreLogo has been deprecated and will be removed from @atlaskit/logo in the next major release. Please use JiraWorkManagementLogo instead.',
    );
  }

  return (
    <Wrapper
      label={label}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      svg={svg({ iconGradientStart, iconGradientStop })}
      testId={testId}
      textColor={textColor}
    />
  );
};
