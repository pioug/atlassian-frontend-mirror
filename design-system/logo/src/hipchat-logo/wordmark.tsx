/* eslint-disable max-len */
import React from 'react';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import Wrapper from '../wrapper';

const svg = () => `
<svg viewBox="0 0 86 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
  <g stroke="none" stroke-width="1" fill-rule="evenodd" fill="inherit">
    <path d="M-6.88338275e-14,6.918 L-6.88338275e-14,24 L2.34,24 L2.34,16.616 L11.336,16.616 L11.336,24 L13.676,24 L13.676,6.918 L11.336,6.918 L11.336,14.38 L2.34,14.38 L2.34,6.918 L-6.88338275e-14,6.918 Z M17.524,7.568 C17.524,8.556 18.174,9.128 19.084,9.128 C19.994,9.128 20.644,8.556 20.644,7.568 C20.644,6.58 19.994,6.008 19.084,6.008 C18.174,6.008 17.524,6.58 17.524,7.568 Z M17.94,24 L20.176,24 L20.176,11 L17.94,11 L17.94,24 Z M29.926,24.26 C28.028,24.26 26.572,23.402 25.792,21.712 L25.792,29.07 L23.556,29.07 L23.556,11 L25.792,11 L25.792,13.34 C26.624,11.624 28.184,10.74 30.186,10.74 C33.644,10.74 35.386,13.678 35.386,17.5 C35.386,21.166 33.566,24.26 29.926,24.26 Z M33.15,17.5 C33.15,14.38 31.902,12.82 29.588,12.82 C27.586,12.82 25.792,14.094 25.792,16.98 L25.792,18.02 C25.792,20.906 27.43,22.18 29.328,22.18 C31.85,22.18 33.15,20.516 33.15,17.5 Z M47.164,21.66 C46.358,21.946 45.526,22.128 44.2,22.128 C40.794,22.128 39.39,19.996 39.39,17.474 C39.39,14.952 40.768,12.82 44.148,12.82 C45.37,12.82 46.254,13.054 47.086,13.444 L47.086,11.364 C46.072,10.896 45.162,10.74 43.992,10.74 C39.364,10.74 37.206,13.548 37.206,17.474 C37.206,21.452 39.364,24.26 43.992,24.26 C45.188,24.26 46.384,24.078 47.164,23.662 L47.164,21.66 Z M60.762,16.382 C60.762,12.716 59.15,10.74 56.238,10.74 C54.366,10.74 52.806,11.624 51.948,13.158 L51.948,5.566 L49.712,5.566 L49.712,24 L51.948,24 L51.948,16.772 C51.948,14.146 53.378,12.768 55.458,12.768 C57.59,12.768 58.526,14.094 58.526,16.772 L58.526,24 L60.762,24 L60.762,16.382 Z M72.722,24 L72.722,21.66 C71.89,23.376 70.33,24.26 68.328,24.26 C64.87,24.26 63.128,21.322 63.128,17.5 C63.128,13.834 64.948,10.74 68.588,10.74 C70.486,10.74 71.942,11.598 72.722,13.288 L72.722,11 L74.958,11 L74.958,24 L72.722,24 Z M65.364,17.5 C65.364,20.62 66.612,22.18 68.926,22.18 C70.928,22.18 72.722,20.906 72.722,18.02 L72.722,16.98 C72.722,14.094 71.084,12.82 69.186,12.82 C66.664,12.82 65.364,14.484 65.364,17.5 Z M81.432,19.892 L81.432,13.08 L84.89,13.08 L84.89,11 L81.432,11 L81.432,8.244 L79.248,8.244 L79.248,11 L77.142,11 L77.142,13.08 L79.248,13.08 L79.248,19.944 C79.248,22.362 80.6,24 83.382,24 C84.058,24 84.5,23.896 84.89,23.792 L84.89,21.634 C84.5,21.712 84.006,21.816 83.486,21.816 C82.108,21.816 81.432,21.036 81.432,19.892 Z"></path>
  </g>
</svg>`;

/**
 * @deprecated HipchatWordmark will be removed from @atlaskit/logo in the next major release.
 */
export const HipchatWordmark = ({
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  label = 'Hipchat',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    warnOnce(
      'HipchatWordmark has been deprecated and will be removed from @atlaskit/logo after June 30 2021.',
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
