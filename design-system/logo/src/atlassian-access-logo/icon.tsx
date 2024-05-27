/* eslint-disable max-len */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import { type LogoProps } from '../types';
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
  return `<svg
      fill="none"
      height="32"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M27.545 24.378 16.96 3.208c-.208-.458-.417-.541-.667-.541-.208 0-.458.083-.708.5-1.5 2.375-2.167 5.126-2.167 8.001 0 4 2.042 7.751 5.042 13.794.334.666.584.791 1.167.791h7.335c.541 0 .833-.208.833-.625 0-.208-.042-.333-.25-.75M12.168 14.377c-.834-1.25-1.084-1.334-1.292-1.334s-.333.084-.708.834L4.875 24.462c-.167.333-.208.458-.208.625 0 .333.291.666.916.666h7.46c.5 0 .875-.416 1.083-1.208.25-1 .334-1.875.334-2.917 0-2.917-1.292-5.751-2.292-7.251"
        fill="${colors.iconColor}"
      />
    </svg>`;
};

/**
 * __Atlassian Access icon__
 *
 * The Atlassian Access icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlassianAccessIcon = ({
  appearance,
  label = 'Atlassian Access',
  size = defaultLogoParams.size,
  testId,
  textColor = defaultLogoParams.textColor,
  iconColor = defaultLogoParams.iconColor,
}: LogoProps) => {
  const { colorMode } = useThemeObserver();
  return (
    <Wrapper
      appearance={appearance}
      svg={svg(
        {
          appearance,
          iconColor,
        },
        colorMode,
      )}
      iconColor={iconColor}
      label={label}
      size={size}
      testId={testId}
      textColor={textColor}
    />
  );
};
