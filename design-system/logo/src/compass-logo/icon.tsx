/* eslint-disable max-len */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = (
  { appearance, iconColor }: LogoProps,
  colorMode: string | undefined,
) => {
  let colors = {
    iconColor,
  };

  if (appearance) {
    colors = getColorsFromAppearance(appearance, colorMode);
  }
  return `<svg fill="none" height="32" viewBox="0 0 32 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" d="M15.667 15.66v5.942H9.713V15.66zV9.722H4.807c-.58.004-1.047.47-1.043 1.04v15.755a1.04 1.04 0 0 0 1.028 1.054h15.771a1.04 1.04 0 0 0 1.042-1.04V15.66zm0-11.88v5.942h5.967v5.938h5.935V4.82a1.04 1.04 0 0 0-1.028-1.053h-.014z"/>
      </svg>
    `;
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
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  const { colorMode } = useThemeObserver();
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      svg={svg({ appearance, iconColor }, colorMode)}
      iconColor={iconColor}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
