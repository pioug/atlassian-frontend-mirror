/* eslint-disable max-len */
import React from 'react';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import Wrapper from '../wrapper';

const svg =
  () => `<svg viewBox="0 0 95 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
  <g stroke="none" stroke-width="1" fill-rule="evenodd" fill="inherit">
    <path d="M5.07,18.956 C5.07,20.646 4.394,21.842 2.418,21.842 C1.56,21.842 0.702,21.686 9.1038288e-15,21.4 L9.1038288e-15,23.662 C0.65,23.896 1.586,24.104 2.808,24.104 C6.032,24.104 7.41,21.946 7.41,18.8 L7.41,6.918 L5.07,6.918 L5.07,18.956 Z M10.894,7.568 C10.894,8.556 11.544,9.128 12.454,9.128 C13.364,9.128 14.014,8.556 14.014,7.568 C14.014,6.58 13.364,6.008 12.454,6.008 C11.544,6.008 10.894,6.58 10.894,7.568 Z M11.31,24 L13.546,24 L13.546,11 L11.31,11 L11.31,24 Z M16.926,24 L19.11,24 L19.11,16.33 C19.11,13.574 20.852,12.716 23.712,13.002 L23.712,10.818 C21.164,10.662 19.864,11.754 19.11,13.288 L19.11,11 L16.926,11 L16.926,24 Z M34.45,24 L34.45,21.66 C33.618,23.376 32.058,24.26 30.056,24.26 C26.598,24.26 24.856,21.322 24.856,17.5 C24.856,13.834 26.676,10.74 30.316,10.74 C32.214,10.74 33.67,11.598 34.45,13.288 L34.45,11 L36.686,11 L36.686,24 L34.45,24 Z M27.092,17.5 C27.092,20.62 28.34,22.18 30.654,22.18 C32.656,22.18 34.45,20.906 34.45,18.02 L34.45,16.98 C34.45,14.094 32.812,12.82 30.914,12.82 C28.392,12.82 27.092,14.484 27.092,17.5 Z M57.018,20.984 C55.77,21.608 54.366,22.024 52.572,22.024 C48.516,22.024 46.046,19.424 46.046,15.498 C46.046,11.572 48.438,8.92 52.442,8.92 C54.418,8.92 55.77,9.336 56.992,10.116 L56.992,7.854 C55.77,6.97 54.106,6.658 52.442,6.658 C46.878,6.658 43.706,10.298 43.706,15.498 C43.706,20.88 46.878,24.26 52.494,24.26 C54.262,24.26 55.952,23.948 57.018,23.246 L57.018,20.984 Z M65.624,24.26 C61.724,24.26 59.436,21.374 59.436,17.474 C59.436,13.574 61.724,10.74 65.624,10.74 C69.498,10.74 71.76,13.574 71.76,17.474 C71.76,21.374 69.498,24.26 65.624,24.26 Z M65.624,12.82 C62.842,12.82 61.62,15.004 61.62,17.474 C61.62,19.944 62.842,22.18 65.624,22.18 C68.38,22.18 69.576,19.944 69.576,17.474 C69.576,15.004 68.38,12.82 65.624,12.82 Z M74.36,24 L76.544,24 L76.544,16.33 C76.544,13.574 78.286,12.716 81.146,13.002 L81.146,10.818 C78.598,10.662 77.298,11.754 76.544,13.288 L76.544,11 L74.36,11 L74.36,24 Z M93.314,23.48 C92.248,24.052 90.61,24.26 89.284,24.26 C84.422,24.26 82.29,21.452 82.29,17.474 C82.29,13.548 84.474,10.74 88.426,10.74 C92.43,10.74 94.042,13.522 94.042,17.474 L94.042,18.488 L84.552,18.488 C84.864,20.698 86.294,22.128 89.362,22.128 C90.87,22.128 92.144,21.842 93.314,21.426 L93.314,23.48 Z M88.322,12.768 C85.956,12.768 84.76,14.302 84.526,16.564 L91.78,16.564 C91.65,14.146 90.558,12.768 88.322,12.768 Z"></path>
  </g>
</svg>`;

/**
 * @deprecated JiraCoreWordmark will be removed from @atlaskit/logo in the next major release. Please use JiraWorkManagementWordmark instead.
 */
export const JiraCoreWordmark = ({
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
      'JiraCoreWordmark has been deprecated and will be removed from @atlaskit/logo in the next major release. Please use JiraWorkManagementWordmark instead.',
    );
  }

  return (
    <Wrapper
      label={label}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      svg={svg()}
      testId={testId}
      textColor={textColor}
    />
  );
};
