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
      <path fill=${colors.iconColor} d="m25.586 15.819-1.618 9.885c-.106.598-.528.95-1.126.95H9.122c-.598 0-1.02-.352-1.126-.95L5.146 8.08c-.105-.598.212-.985.775-.985h20.123c.562 0 .88.387.773.985l-.773 4.644c-.106.668-.493.95-1.126.95H12.816c-.176 0-.282.105-.246.316l.95 5.84c.035.14.14.246.281.246h4.362c.141 0 .246-.105.282-.246l.668-4.222c.07-.527.422-.738.915-.738h4.75c.703 0 .914.351.808.95"/>
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
      <linearGradient id="${id}" x1="100%" x2="45.339%" y1="29.23%" y2="75.038%">
        <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="0%"></stop>
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path fill="${
        colors.iconColor
      }" d="M4.78580435,5 C4.55423538,4.99701333 4.33319771,5.09657765 4.18198458,5.27198488 C4.03077145,5.44739211 3.96486141,5.68068714 4.00193478,5.9092887 L7.32946109,26.1096074 C7.3703589,26.355373 7.49665951,26.578828 7.68612174,26.7406224 C7.87680866,26.9055104 8.11992598,26.9972003 8.37200761,26.9992993 L14.5488998,19.5995707 L13.6827239,19.5995707 L12.3227102,12.3958093 L27.3886833,12.3958093 L28.4469072,5.91712739 C28.4862006,5.68935393 28.4229655,5.45584955 28.2741046,5.27903 C28.1252437,5.10221045 27.9059335,5.00010264 27.6747957,5 L4.78580435,5 Z" />
      <path fill="url(#${id})" d="M27.3886833,12.3958093 L20.0320674,12.3958093 L18.7974728,19.5995707 L13.7023207,19.5995707 L7.68612174,26.7445417 C7.87680866,26.9094297 8.11992598,27.0011197 8.37200761,27.0032187 L24.3394307,27.0032187 C24.727754,27.0082167 25.0611955,26.7281258 25.1233002,26.3447683 L27.3886833,12.3958093 Z"/>
    </g>
  </svg>`;
  }
};

/**
 * __Bitbucket icon__
 *
 * The Bitbucket icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketIcon = ({
  appearance,
  label = 'Bitbucket',
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
