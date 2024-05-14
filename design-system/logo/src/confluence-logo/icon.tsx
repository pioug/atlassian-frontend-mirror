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
    // Currently the user can style the confluence icon using only iconGradientStop and iconGradientStart
    // the following is used to mimic this edge case as these two props aren't used on the new logos
    if (colors.iconColor === 'inherit') {
      colors.iconColor = iconGradientStop;
    }
    if (appearance) {
      colors = getColorsFromAppearance(appearance, colorMode);
    }
    return `<svg fill="none" height="32" viewBox="0 0 32 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" d="M25.769 20.234c-6.584-3.183-8.507-3.66-11.282-3.66-3.254 0-6.028 1.355-8.507 5.16l-.406.622c-.333.513-.407.696-.407.915s.11.403.517.659l4.18 2.598c.222.146.407.22.592.22.222 0 .37-.11.592-.44l.665-1.024c1.036-1.574 1.96-2.086 3.144-2.086 1.036 0 2.257.293 3.773 1.025l4.365 2.049c.443.22.924.11 1.146-.403l2.071-4.537c.222-.512.074-.842-.444-1.098M6.572 12.22c6.584 3.184 8.507 3.66 11.281 3.66 3.255 0 6.03-1.354 8.507-5.16l.407-.622c.333-.512.407-.695.407-.915s-.11-.402-.518-.658l-4.18-2.598c-.221-.147-.406-.22-.591-.22-.222 0-.37.11-.592.44l-.666 1.024c-1.035 1.573-1.96 2.086-3.144 2.086-1.035 0-2.256-.293-3.772-1.025L9.346 6.183c-.444-.22-.924-.11-1.146.402l-2.072 4.538c-.222.512-.074.841.444 1.098"/>
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
        <linearGradient x1="60.6779047%" y1="137.626433%" x2="14.341981%" y2="112.08042%" id="${id}-1">
          <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="0%"></stop>
          <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="12.3282701%" y1="-53.9760846%" x2="74.1300776%" y2="-33.2553066%" id="${id}-2">
          <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="0%"></stop>
          <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g stroke="none" stroke-width="1" fill-rule="nonzero">
        <path fill="url(#${id}-1)" d="M5.21454927,22.0245336 C4.97082816,22.4219865 4.69711061,22.8831818 4.46463817,23.2506383 C4.25655728,23.602269 4.36826343,24.0557627 4.71585838,24.2705174 L9.59028054,27.2701618 C9.76138278,27.3758032 9.96774369,27.4083016 10.1630326,27.3603607 C10.3583215,27.3124197 10.5261749,27.1880564 10.6289074,27.015192 C10.8238843,26.6889807 11.0751045,26.2652809 11.3488221,25.8115847 C13.2798432,22.6244625 15.2221129,23.0144163 18.7241978,24.686718 L23.5573748,26.9851956 C23.7404243,27.0723219 23.9509502,27.0816253 24.1409716,27.0109854 C24.3309931,26.9403455 24.4843191,26.7957811 24.5660052,26.61024 L26.8869801,21.3608623 C27.0509607,20.9859459 26.8841076,20.5487907 26.5120245,20.3784788 C25.4921454,19.8985357 23.4636359,18.942399 21.6376024,18.0612535 C15.0683811,14.8741313 9.48529299,15.0841064 5.21454927,22.0245336 Z"></path>
        <path fill="url(#${id}-2)" d="M27.0752616,9.74267061 C27.3190367,9.34512979 27.5928148,8.88383241 27.8253387,8.51629467 C28.0334656,8.1645861 27.9217347,7.71099215 27.5740629,7.4961899 L22.6985622,4.49588177 C22.5250856,4.3802891 22.3113292,4.3421035 22.1085604,4.39048341 C21.9057917,4.43886333 21.7323024,4.56944439 21.6297024,4.75090796 C21.4346824,5.07719147 21.1834066,5.50098499 20.9096284,5.9547816 C18.9781801,9.14260899 17.0354806,8.75256893 13.5326208,7.07989715 L8.71337588,4.78466143 C8.53028584,4.69751579 8.31971336,4.68821035 8.1296499,4.75886591 C7.93958645,4.82952147 7.78622651,4.97411777 7.70452227,5.15969994 L5.38303386,10.4102392 C5.21901692,10.7852385 5.38590698,11.2224905 5.75807237,11.3928401 C6.77817714,11.8728894 8.80713551,12.8292376 10.6335731,13.7105781 C17.2192494,16.8946551 22.8035729,16.6846336 27.0752616,9.74267061 Z"></path>
      </g>
    </svg>`;
  }
};

/**
 * __Confluence icon__
 *
 * The Confluence icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceIcon = ({
  appearance,
  label = 'Confluence',
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
