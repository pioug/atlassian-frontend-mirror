/* eslint-disable max-len */
import React from 'react';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance, iconColor }: LogoProps) => {
  let colors = {
    iconColor,
  };

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
  }

  const loomIconColor = appearance === 'brand' ? '#625DF5' : colors.iconColor;

  return `
    <svg
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="${loomIconColor}"
        d="M29 14.5543H21.3972L27.9816 10.7528L26.5356 8.24758L19.9513 12.0491L23.7519 5.46521L21.2467 4.01838L17.446 10.6022V3H14.5539V10.6029L10.7519 4.01838L8.24743 5.46448L12.0488 12.0483L5.46441 8.24758L4.01835 10.7521L10.6027 14.5535H3V17.4458H10.602L4.01835 21.2472L5.46441 23.7524L12.0481 19.9517L8.2467 26.5355L10.7519 27.9816L14.5532 21.3971V29H17.4453V21.3978L21.246 27.9816L23.7511 26.5355L19.9498 19.951L26.5341 23.7524L27.9802 21.2472L21.3965 17.4464H28.9985V14.5543H29ZM16 19.9334C13.8193 19.9334 12.0517 18.1659 12.0517 15.9851C12.0517 13.8043 13.8193 12.0367 16 12.0367C18.1807 12.0367 19.9482 13.8043 19.9482 15.9851C19.9482 18.1659 18.1807 19.9334 16 19.9334Z"
      />
    </svg>
  `;
};

/**
 * __Loom icon__
 *
 * The Loom icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomIcon = ({
  appearance,
  label = 'Loom',
  size = defaultLogoParams.size,
  testId,
  iconColor = defaultLogoParams.iconColor,
  iconGradientStart = defaultLogoParams.iconGradientStart,
  iconGradientStop = defaultLogoParams.iconGradientStop,
  textColor = defaultLogoParams.textColor,
}: LogoProps) => {
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      svg={svg({
        appearance,
        iconGradientStart,
        iconGradientStop,
        iconColor,
      })}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
