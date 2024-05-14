/* eslint-disable max-len */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearanceOldLogos } from '../utils';
import Wrapper from '../wrapper';

const svg = ({
  appearance,
  colorMode,
  iconColor,
  textColor,
}: LogoProps & { colorMode: string | undefined }) => {
  let colors = {
    iconColor,
    textColor,
  };

  if (appearance) {
    colors = getColorsFromAppearanceOldLogos(appearance);
  }

  const loomTextColor =
    colorMode === 'light' && appearance === 'brand' ? '#222' : colors.textColor;
  const loomIconColor = appearance === 'brand' ? '#625DF5' : colors.iconColor;

  return `
    <svg
      fill="none"
      height="32"
      viewBox="0 0 87 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="m33.0381 6.48975v19.01995h3.492v-19.01995zm36.8275 6.09465h-3.3347v12.9261h3.4912v-7.5659c0-1.4189.893-2.5487 2.4162-2.5487 1.5762 0 2.285 1.0505 2.285 2.4431v7.6715h3.465v-7.5659c0-1.3927.8929-2.5487 2.3899-2.5487 1.6017 0 2.285 1.0505 2.285 2.4431v7.6707h3.3871v-8.3806c0-3.4672-2.2843-4.9123-4.6734-4.9123-1.7067 0-3.0732.5772-4.0966 2.1541-.6563-1.3919-2.0737-2.1541-3.8337-2.1541-1.4174 0-3.0723.6836-3.781 1.9445zm-25.4441 13.2997c-3.9339 0-6.7826-2.9178-6.7826-6.8368 0-3.8565 2.8395-6.8437 6.7826-6.8437 3.9623 0 6.7827 3.0149 6.7827 6.8437 0 3.8905-2.8504 6.8368-6.7827 6.8368zm0-10.5168c-2.029 0-3.6794 1.6507-3.6794 3.6808 0 2.03 1.6504 3.6808 3.6794 3.6808s3.6786-1.6508 3.6786-3.6808c0-2.0301-1.6496-3.6808-3.6786-3.6808zm7.4592 3.68c0 3.919 2.8487 6.8368 6.7827 6.8368 3.9307 0 6.7826-2.9463 6.7826-6.8368 0-3.8288-2.8203-6.8437-6.7826-6.8437-3.9431 0-6.7827 2.9872-6.7827 6.8437zm3.0609-.0008c0-2.0523 1.6696-3.7232 3.7218-3.7232 2.0513 0 3.7209 1.6709 3.7218 3.7232 0 2.0524-1.6698 3.7233-3.7218 3.7233-2.0522 0-3.7218-1.6709-3.7218-3.7233z"
        fill="${loomTextColor}"
        fill-rule="evenodd"
      />
      <path
        d="m26 14.5543h-7.6028l6.5844-3.8015-1.446-2.50522-6.5843 3.80152 3.8006-6.58389-2.5052-1.44683-3.8007 6.58382v-7.6022h-2.8921v7.6029l-3.80205-6.58452-2.50442 1.4461 3.80136 6.58382-6.58438-3.80072-1.44606 2.50452 6.58438 3.8014h-7.60273v2.8923h7.60201l-6.58366 3.8014 1.44606 2.5052 6.58365-3.8007-3.80136 6.5838 2.50515 1.4461 3.80135-6.5845v7.6029h2.8921v-7.6022l3.8007 6.5838 2.5051-1.4461-3.8013-6.5845 6.5843 3.8014 1.4461-2.5052-6.5837-3.8008h7.602v-2.8921zm-13 5.3791c-2.1807 0-3.9483-1.7675-3.9483-3.9483s1.7676-3.9484 3.9483-3.9484 3.9482 1.7676 3.9482 3.9484-1.7675 3.9483-3.9482 3.9483z"
        fill="${loomIconColor}"
      />
    </svg>
  `;
};

/**
 * __Loom logo__
 *
 * The Loom logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomLogo = ({
  appearance,
  label = 'Loom',
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
      iconColor={iconColor}
      size={size}
      svg={svg({
        appearance,
        size,
        colorMode,
        iconColor,
        textColor,
      })}
      testId={testId}
      textColor={textColor}
    />
  );
};
