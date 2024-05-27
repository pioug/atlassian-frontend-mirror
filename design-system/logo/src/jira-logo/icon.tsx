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
      <path fill="${colors.iconColor}" d="M11.034 21.99h-2.22c-3.346 0-5.747-2.05-5.747-5.052h11.932c.619 0 1.019.44 1.019 1.062v12.007c-2.983 0-4.984-2.416-4.984-5.784zm5.893-5.967h-2.219c-3.347 0-5.748-2.013-5.748-5.015h11.933c.618 0 1.055.402 1.055 1.025V24.04c-2.983 0-5.02-2.416-5.02-5.784zm5.93-5.93h-2.219c-3.347 0-5.748-2.05-5.748-5.052h11.933c.618 0 1.018.439 1.018 1.025v12.007c-2.983 0-4.984-2.416-4.984-5.784z"/>
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
        <linearGradient x1="94.092%" x2="56.535%" y1="6.033%" y2="43.087%" id="${id}">
          <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="18%"></stop>
          <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g stroke="none" stroke-width="1" fill-rule="nonzero">
        <path fill="${
          colors.iconColor
        }" d="M26.0406546,5 L14.9983562,5 C14.9983562,6.32163748 15.5233746,7.58914413 16.4579134,8.52368295 C17.3924523,9.45822178 18.6599589,9.98324022 19.9815964,9.98324022 L22.0151159,9.98324022 L22.0151159,11.9465283 C22.0168782,14.6974491 24.2474348,16.9265768 26.9983562,16.9265762 L26.9983562,5.95770152 C26.9983562,5.42877757 26.5695786,5 26.0406546,5 Z"></path>
        <path fill="url(#${id})" d="M20.0420436,11 L9,11 C9.00176139,13.7504065 11.2309666,15.9796117 13.9813731,15.9813731 L16.0154337,15.9813731 L16.0154337,17.9451836 C16.0154337,19.2671728 16.5405919,20.5350167 17.4753794,21.4698042 C18.4101669,22.4045917 19.6780108,22.9297499 21,22.9297499 L21,11.9579564 C21,11.4288917 20.5711083,11 20.0420436,11 Z"></path>
        <path fill="url(#${id})" d="M14.0420436,17 L3,17 C3.00176275,19.7516528 5.23291286,21.9813736 7.98456626,21.9813731 L10.0250133,21.9813731 L10.0250133,23.9451836 C10.0250082,26.6943468 12.2508419,28.9244664 15,28.9297499 L15,17.9579564 C15,17.4288917 14.5711083,17 14.0420436,17 Z"></path>
      </g>
    </svg>`;
  }
};

/**
 * __Jira icon__
 *
 * The Jira icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraIcon = ({
  appearance,
  label = 'Jira',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
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
