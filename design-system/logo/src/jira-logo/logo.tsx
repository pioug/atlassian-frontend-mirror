/* eslint-disable max-len */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import type { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = (
  { appearance, iconColor, textColor }: LogoProps,
  colorMode: string | undefined,
) => {
  let colors = {
    iconColor,
    textColor,
  };

  if (appearance) {
    colors = getColorsFromAppearance(appearance, colorMode);
  }
  return `<svg fill="none" height="32" viewBox="0 0 77 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" d="M7.967 21.323H5.748C2.401 21.323 0 19.273 0 16.271h11.933c.618 0 1.018.44 1.018 1.062V29.34c-2.983 0-4.984-2.416-4.984-5.784zm5.894-5.967h-2.22c-3.346 0-5.747-2.013-5.747-5.015h11.932c.618 0 1.055.402 1.055 1.025v12.007c-2.983 0-5.02-2.416-5.02-5.784zm5.93-5.93h-2.22c-3.347 0-5.748-2.05-5.748-5.052h11.933c.618 0 1.019.439 1.019 1.025v12.007c-2.983 0-4.984-2.416-4.984-5.784z"/>
      <path fill="${colors.textColor}" d="M65.023 17.874c0 3.68 1.472 5.52 4.202 5.52 2.36 0 4.477-1.503 4.477-4.907V17.26c0-3.404-1.932-4.906-4.17-4.906-2.975 0-4.509 1.962-4.509 5.52m8.679 7.666v-2.76c-.981 2.024-2.821 3.067-5.183 3.067-4.078 0-6.133-3.465-6.133-7.973 0-4.324 2.147-7.974 6.44-7.974 2.239 0 3.956 1.012 4.876 3.006v-2.699h2.637V25.54zM55.91 16.493v9.047h-2.577V10.207h2.576v2.698c.89-1.809 2.423-3.097 5.428-2.913v2.576c-3.373-.337-5.428.675-5.428 3.925M46.224 6.159c0-1.165.767-1.84 1.84-1.84s1.84.675 1.84 1.84-.767 1.84-1.84 1.84-1.84-.675-1.84-1.84m.49 19.381V10.207h2.638V25.54zm-6.427-5.95V5.393h2.76v14.015c0 3.71-1.626 6.256-5.428 6.256-1.442 0-2.546-.246-3.312-.522v-2.668c.828.338 1.84.522 2.852.522 2.33 0 3.128-1.41 3.128-3.404"/>
    </svg>`;
};

/**
 * __Jira logo__
 *
 * The Jira logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraLogo = ({
  appearance,
  label = 'Jira',
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
      svg={svg(
        {
          appearance,
          iconColor,
          textColor,
        },
        colorMode,
      )}
      testId={testId}
      textColor={textColor}
    />
  );
};
