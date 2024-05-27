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
      <path fill=${colors.iconColor} d="M18.79 13.257h7.325c1.1 0 1.476 1.046.805 1.878L15.464 29.274c-3.702-2.951-3.353-7.62-.644-11.027zm-5.66 5.634H5.806c-1.1 0-1.476-1.046-.805-1.878L16.457 2.874c3.702 2.951 3.3 7.566.617 11z"/>
    </svg>`;
  } else {
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ iconGradientStart: iconGradientStop });

    if (appearance) {
      colors = getColorsFromAppearanceOldLogos(appearance);
    }
    return `
  <svg viewBox="0 0 32 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="40.063%" x2="69.955%" y1="0%" y2="50%" id="${id}">
        <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="0%"></stop>
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path fill="url(#${id})" d="M18.4838727,13.07 L26.3504842,13.1005351 C26.8138769,13.102696 27.2364009,13.3661074 27.4423455,13.781227 C27.64829,14.1963467 27.6024124,14.6921363 27.3237913,15.0624169 L15.7128101,30.5666265 C13.9597489,29.2574035 12.7986975,27.3052951 12.485161,25.1398891 C12.1716246,22.974483 12.731296,20.7732253 14.041012,19.0205325 L18.4838727,13.07 Z"></path>
      <path fill="${
        colors.iconColor
      }" d="M14.0396053,19.0156579 L6.22105263,18.9660526 C5.75779361,18.9638923 5.33539149,18.700557 5.12950634,18.2855571 C4.92362119,17.8705572 4.96948557,17.3749106 5.24802632,17.0047368 L16.7411842,1.65 C18.4937397,2.9588453 19.6544561,4.91039056 19.9679021,7.0751719 C20.2813481,9.23995324 19.7218382,11.4405759 18.4125,13.1927632 L14.0396053,19.0156579 Z"></path>
    </g>
  </svg>`;
  }
};

/**
 * __Jira Service Management icon__
 *
 * The Jira Service Management icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraServiceManagementIcon = ({
  appearance,
  label = 'Jira Service Management',
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
