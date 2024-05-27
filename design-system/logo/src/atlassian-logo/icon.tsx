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
      <path fill="${colors.iconColor}" d="M27.545 24.378 16.96 3.208c-.208-.458-.417-.541-.667-.541-.208 0-.458.083-.708.5-1.5 2.375-2.167 5.125-2.167 8 0 4.001 2.042 7.752 5.042 13.795.334.666.584.791 1.167.791h7.335c.541 0 .833-.208.833-.625 0-.208-.042-.333-.25-.75M12.168 14.377c-.834-1.25-1.084-1.334-1.292-1.334s-.333.083-.708.834L4.875 24.46c-.167.334-.208.459-.208.625 0 .334.291.667.916.667h7.46c.5 0 .875-.416 1.083-1.208.25-1 .334-1.876.334-2.917 0-2.917-1.292-5.751-2.292-7.251"/>
    </svg>`;
  } else {
    if (appearance) {
      colors = getColorsFromAppearanceOldLogos(appearance);
    }
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ iconGradientStart: iconGradientStop });
    return `
    <svg viewBox="0 0 32 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="14.8402" y1="15.8324" x2="8.6599" y2="26.5369" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="0%"></stop>
          <stop stop-color="${colors.iconGradientStop}" offset="0.9228"></stop>
        </linearGradient>
      </defs>
      <path fill="url(#${id})" d="M11.6397 14.0398C11.2789 13.643 10.7378 13.679 10.4852 14.148L4.64091 25.8728C4.42446 26.3418 4.74912 26.8829 5.25419 26.8829H13.4074C13.6599 26.8829 13.9125 26.7386 14.0207 26.4861C15.7885 22.8424 14.7061 17.3227 11.6397 14.0398Z" />
      <path fill="${
        colors.iconColor
      }" d="M15.9343 3.36124C12.6513 8.55622 12.8678 14.2923 15.0324 18.6215C17.1969 22.9506 18.8565 26.2336 18.9647 26.4861C19.0729 26.7386 19.3254 26.8829 19.578 26.8829H27.7312C28.2363 26.8829 28.597 26.3418 28.3445 25.8728C28.3445 25.8728 17.3774 3.93846 17.0887 3.39732C16.8723 2.89225 16.259 2.85618 15.9343 3.36124Z" />
    </svg>`;
  }
};

/**
 * __Atlassian icon__
 *
 * The Atlassian icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlassianIcon = ({
  appearance,
  label = 'Atlassian',
  size = defaultLogoParams.size,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  textColor = defaultLogoParams.textColor,
  testId,
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
      textColor={textColor}
      size={size}
      testId={testId}
    />
  );
};
