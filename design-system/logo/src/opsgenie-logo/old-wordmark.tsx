/* eslint-disable max-len */
import React from 'react';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import Wrapper from '../wrapper';

const svg = () => `
<svg viewBox="0 0 148 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
  <g fill-rule="evenodd" fill="inherit">
    <path d="M0 14.996c0-5.155 2.958-8.772 8.248-8.772 5.291 0 8.24 3.62 8.24 8.772 0 5.203-2.957 8.846-8.225 8.846C2.996 23.842 0 20.196 0 14.996zm2.342 0c0 3.617 1.692 6.61 5.915 6.61 4.224 0 5.865-2.993 5.865-6.61 0-3.549-1.692-6.533-5.882-6.533-4.191 0-5.898 2.993-5.898 6.533zm19.363 6.297v7.364h-2.239V10.572h2.24v2.342c.83-1.718 2.395-2.602 4.397-2.602 3.46 0 5.205 2.94 5.205 6.763 0 3.67-1.822 6.767-5.465 6.767-1.9 0-3.357-.857-4.138-2.55zm3.8-8.9c-2.005 0-3.8 1.275-3.8 4.165v1.04c0 2.887 1.639 4.162 3.55 4.162 2.522 0 3.823-1.665 3.823-4.685-.009-3.12-1.257-4.681-3.573-4.681zm12.493 11.45a10.056 10.056 0 0 1-4.53-.962v-2.366A10.189 10.189 0 0 0 38.1 21.79c1.719 0 2.603-.701 2.603-1.719 0-1.017-.754-1.561-3.227-2.159-2.889-.703-4.113-1.821-4.113-3.954 0-2.265 1.744-3.643 4.71-3.643a9.248 9.248 0 0 1 4.192.934v2.319c-1.562-.78-2.837-1.183-4.218-1.183-1.638 0-2.523.57-2.523 1.588 0 .91.625 1.479 3.02 2.055 2.887.701 4.345 1.775 4.345 4.035 0 2.14-1.405 3.78-4.892 3.78zm16.76-2.603c-.834 1.718-2.395 2.602-4.4 2.602-3.434 0-5.153-2.94-5.153-6.767 0-3.667 1.796-6.763 5.416-6.763 1.898 0 3.356.857 4.14 2.549v-2.29h2.186v11.83c0 3.828-1.796 6.404-6.457 6.404a13.17 13.17 0 0 1-4.631-.701v-2.189c1.456.504 2.984.77 4.525.787 3.253 0 4.374-1.742 4.374-4.164V21.24zm-3.8.52c2.002 0 3.8-1.275 3.8-4.161v-1.041c0-2.89-1.641-4.164-3.549-4.164-2.526 0-3.827 1.665-3.827 4.681.009 3.12 1.26 4.685 3.576 4.685zm15.589 2.082c-4.868 0-7-2.81-7-6.802 0-3.93 2.185-6.74 6.142-6.74 4.007 0 5.62 2.783 5.62 6.74v1.026h-9.5c.313 2.212 1.745 3.644 4.815 3.644 1.35-.001 2.69-.24 3.957-.704v2.07c-1.068.56-2.706.766-4.034.766zm-4.762-7.69h7.26c-.13-2.421-1.224-3.8-3.462-3.8-2.366-.012-3.55 1.523-3.798 3.789v.012zm23.24 7.43h-2.239v-7.858c0-2.342-.937-3.384-3.07-3.384-2.07 0-3.513 1.379-3.513 4.008v7.234h-2.239V10.569h2.239V12.7a4.558 4.558 0 0 1 4.11-2.392c2.994 0 4.712 2.07 4.712 5.646v7.627zm4.268-18.008a1.461 1.461 0 0 1 1.561 1.561 1.562 1.562 0 1 1-3.123 0 1.461 1.461 0 0 1 1.562-1.561zm-1.145 4.998h2.24v13.013h-2.24V10.572zm12.363 13.27c-4.868 0-7-2.81-7-6.802 0-3.93 2.185-6.74 6.139-6.74 4.007 0 5.62 2.783 5.62 6.74v1.026h-9.497c.313 2.212 1.745 3.644 4.815 3.644 1.35-.001 2.69-.24 3.957-.704v2.07c-1.068.56-2.706.766-4.034.766zm-4.762-7.701h7.264c-.13-2.422-1.225-3.8-3.464-3.8-2.371 0-3.566 1.534-3.8 3.8z" />
  </g>
</svg>`;

/**
 * @deprecated OpsGenieWordmark is incorrectly cased and will be removed from atlaskit/logo in the next major release. Please use OpsgenieLogo (no capital 'g') instead.
 */
export const OpsGenieWordmark = ({
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    warnOnce(
      'OpsGenieWordmark will be renamed to OpsgenieWordmark in the next major release. Please use OpsgenieWordmark instead.',
    );
  }

  return (
    <Wrapper
      svg={svg()}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
