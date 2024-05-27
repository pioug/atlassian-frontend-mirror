/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import { type LogoProps } from '../types';
import {
  getColorsFromAppearance,
  getColorsFromAppearanceOldLogos,
} from '../utils';
import Wrapper from '../wrapper';

const svg = (
  { appearance, iconGradientStart, iconGradientStop, iconColor }: LogoProps,
  colorMode: string | undefined,
) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
  };

  if (
    getBooleanFF(
      'platform.design-system-team.brand-refresh-update-product-logos_q7coo',
    )
  ) {
    if (appearance) {
      colors = getColorsFromAppearance(appearance, colorMode);
    }
    return `<svg fill="none" height="32" viewBox="0 0 32 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" d="M16 12.604c-3.033 0-5.981 1.37-8.39 3.489q-.375.373-.748.373c-.208 0-.415-.124-.581-.332l-3.032-3.572c-.166-.207-.25-.415-.25-.581 0-.25.125-.457.374-.706 3.655-3.24 8.1-5.067 12.627-5.067s8.97 1.827 12.626 5.067c.249.249.374.457.374.706 0 .166-.084.374-.25.581l-3.032 3.572c-.166.208-.373.332-.581.332q-.374 0-.748-.374c-2.409-2.118-5.358-3.488-8.39-3.488m0 13.374c-3.365 0-6.106-2.742-6.106-6.064S12.635 13.85 16 13.85s6.106 2.7 6.106 6.064-2.741 6.063-6.105 6.063"/>
    </svg>`;
  } else {
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ iconGradientStart: iconGradientStop });

    if (appearance) {
      colors = getColorsFromAppearanceOldLogos(appearance);
    }
    return `<svg viewBox="0 0 32 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
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
  }
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
  const { colorMode } = useThemeObserver();
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      svg={svg(
        {
          appearance,
          iconGradientStart,
          iconGradientStop,
          iconColor,
        },
        colorMode,
      )}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
