/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
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
      <path fill="${colors.iconColor}" d="M15.667 15.66v5.942H9.713V15.66zV9.722H4.807c-.58.004-1.047.47-1.043 1.04v15.755a1.04 1.04 0 0 0 1.028 1.054h15.771a1.04 1.04 0 0 0 1.042-1.04V15.66zm0-11.88v5.942h5.967v5.938h5.935V4.82a1.04 1.04 0 0 0-1.028-1.053h-.014z"/>
      </svg>
    `;
  } else {
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ iconGradientStart: iconGradientStop });

    if (appearance) {
      colors = getColorsFromAppearanceOldLogos(appearance);
    }
    return `<svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <linearGradient
      id="${id}"
      gradientUnits="userSpaceOnUse"
      x1="20.8536"
      x2="11.8744"
      y1="11.2763"
      y2="20.2556"
    >
      <stop offset="20%" stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } />
      <stop offset="100%" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <path
      d="m16.4644 15.6278v5.309h-5.2337v-5.309h5.2337v-5.3059h-9.54745c-.12228.0008-.24319.0259-.3557.0738-.1125.048-.21436.1178-.29966.2054-.08529.0876-.15233.1914-.1972.3051-.04487.1138-.0667.2353-.0642.3576v14.0653c-.0025.1223.01933.2438.0642.3576.04487.1137.11191.2175.1972.3051.0853.0876.18716.1574.29966.2054.11251.0479.23342.073.3557.0738h13.85185c.1223-.0008.2432-.0259.3557-.0738.1125-.048.2144-.1178.2997-.2054s.1523-.1914.1972-.3051c.0449-.1138.0667-.2353.0642-.3576v-9.7013z"
      fill="url(#${id})"
    />
    <path
      d="m16.4636 5.01256v5.30904h5.2463v5.3059h5.218v-9.68562c.0025-.12227-.0194-.24381-.0642-.35757-.0449-.11376-.1119-.21747-.1972-.3051s-.1872-.15744-.2997-.20537c-.1125-.04794-.2334-.07303-.3557-.07384z"
      fill="${colors.iconGradientStop}"
    />
  </svg>`;
  }
};

/**
 * __Compass icon__
 *
 * The Compass icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const CompassIcon = ({
  appearance,
  label = 'Compass',
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
        { appearance, iconGradientStart, iconGradientStop, iconColor },
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
