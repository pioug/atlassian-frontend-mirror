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
  {
    appearance,
    iconGradientStart,
    iconGradientStop,
    iconColor,
    textColor,
  }: LogoProps,
  colorMode: string | undefined,
) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
    textColor,
  };
  if (
    getBooleanFF(
      'platform.design-system-team.brand-refresh-update-product-logos_q7coo',
    )
  ) {
    if (appearance) {
      colors = getColorsFromAppearance(appearance, colorMode);
    }
    return `<svg viewBox="0 0 146 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.04 25.727c0-3.604-2.949-6.517-6.517-6.517H6.517v-5.497H0v10.813c0 .837.364 1.201 1.201 1.201zM0 6.687c0 3.604 2.876 6.517 6.48 6.517h6.043V18.7h6.517V7.888q0-1.2-1.201-1.201z" fill="${colors.iconColor}"/>
      <path d="M144.993 16.555v8.985h-2.638v-9.26c0-2.76-1.104-3.988-3.618-3.988-2.454 0-4.14 1.626-4.14 4.723v8.525h-2.638V10.207h2.638v2.515c.981-1.81 2.79-2.822 4.845-2.822 3.527 0 5.551 2.423 5.551 6.655m-19.589 7.759V22.78c-.982 2.024-2.822 3.067-5.183 3.067-4.048 0-6.072-3.465-6.072-7.973 0-4.324 2.116-7.974 6.379-7.974 2.238 0 3.956 1.012 4.876 3.006v-2.699h2.576V24.16c0 4.508-2.116 7.544-7.606 7.544-2.576 0-3.986-.337-5.458-.828V28.3c1.686.552 3.434.92 5.336.92 3.833 0 5.152-2.054 5.152-4.906m-8.679-6.44c0 3.68 1.472 5.52 4.201 5.52 2.362 0 4.478-1.503 4.478-4.907V17.26c0-3.404-1.932-4.906-4.171-4.906-2.975 0-4.508 1.962-4.508 5.52M107.96 6.16c0-1.166.766-1.84 1.84-1.84 1.073 0 1.84.674 1.84 1.84S110.873 8 109.8 8c-1.074 0-1.84-.675-1.84-1.84m.49 19.38V10.208h2.638v15.334h-2.638Zm-2.537-.03c-.215.061-.675.122-1.349.122-2.515 0-4.11-1.196-4.11-4.017V3.798h2.638v17.51c0 1.38.92 1.871 2.054 1.871.276 0 .46 0 .767-.03v2.36ZM88.83 21.523c-1.534 0-3.098-.184-4.815-.521l-1.687 4.539h-3.097l7.942-20.148h3.496l7.943 20.148h-3.097l-1.687-4.57c-1.81.368-3.373.552-4.999.552Zm0-2.453c1.287 0 2.606-.153 4.17-.399l-4.079-11.04-4.078 11.07c1.502.246 2.76.369 3.986.369Zm-27.807-1.196c0 3.68 1.472 5.52 4.202 5.52 2.36 0 4.477-1.503 4.477-4.907V17.26c0-3.404-1.932-4.906-4.17-4.906-2.975 0-4.509 1.962-4.509 5.52m8.679 7.666v-2.76c-.981 2.024-2.822 3.067-5.183 3.067-4.079 0-6.133-3.465-6.133-7.973 0-4.324 2.146-7.974 6.44-7.974 2.239 0 3.956 1.012 4.876 3.006v-2.699h2.637V25.54zM51.91 16.494v9.047h-2.577V10.207h2.576v2.699c.89-1.81 2.423-3.097 5.428-2.913v2.576c-3.373-.338-5.428.674-5.428 3.925ZM42.224 6.16c0-1.166.767-1.84 1.84-1.84s1.84.674 1.84 1.84S45.137 8 44.064 8s-1.84-.675-1.84-1.84m.49 19.38V10.208h2.638v15.334h-2.637Zm-6.427-5.949V5.393h2.76v14.014c0 3.71-1.626 6.256-5.428 6.256-1.442 0-2.546-.245-3.312-.521v-2.668c.828.337 1.84.521 2.852.521 2.33 0 3.128-1.41 3.128-3.404" fill="${colors.textColor}"/>
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

    return `
    <svg height="32" viewBox="0 0 147 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="${id}-1" x1="8.97104" y1="20.5458" x2="10.5214" y2="12.6394" gradientUnits="userSpaceOnUse">
          <stop offset="0.15" stop-color="${colors.iconGradientStart}"  ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } />
          <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="${id}-2" x1="12.1408" y1="10.8472" x2="10.5904" y2="18.7536" gradientUnits="userSpaceOnUse">
          <stop offset="0.15" stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } />
          <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g fill="${colors.textColor}">
        <path d="M36.6401 4.60829H39.4754V18.6632C39.4754 22.3692 37.7886 24.9565 33.8766 24.9565C32.4051 24.9565 31.2566 24.7117 30.467 24.432V21.7399C31.3284 22.0895 32.3692 22.2644 33.41 22.2644C35.8146 22.2644 36.6401 20.8658 36.6401 18.838V4.60829Z" />
        <path d="M44.6076 3.52444C45.7202 3.52444 46.5097 4.18873 46.5097 5.37745C46.5097 6.53121 45.7202 7.23046 44.6076 7.23046C43.495 7.23046 42.7054 6.56618 42.7054 5.37745C42.7054 4.18873 43.495 3.52444 44.6076 3.52444ZM43.2438 9.4331H45.9714V24.8166H43.2438V9.4331Z" />
        <path d="M52.7545 24.8166H50.0987V9.43309H52.7545V12.1252C53.6877 10.3072 55.2668 9.01354 58.3534 9.18835V11.7756C54.872 11.426 52.7545 12.4399 52.7545 15.7263V24.8166Z" />
        <path d="M71.0943 22.0546C70.0894 24.0824 68.1872 25.1313 65.7467 25.1313C61.5476 25.1313 59.4301 21.67 59.4301 17.1249C59.4301 12.7895 61.6552 9.11844 66.0697 9.11844C68.3666 9.11844 70.1611 10.1324 71.0943 12.1252V9.4331H73.8219V24.8166H71.0943V22.0546ZM66.4645 22.6489C68.905 22.6489 71.0584 21.1455 71.0584 17.7192V16.4955C71.0584 13.0692 69.0844 11.5658 66.7516 11.5658C63.701 11.5658 62.1218 13.5237 62.1218 17.0899C62.1577 20.8309 63.6651 22.6489 66.4645 22.6489Z" />
        <path d="M83.9431 20.2715L82.2204 24.8166H79.0262L87.209 4.60829H90.798L98.9809 24.8166H95.7867L94.064 20.2365C92.1977 20.6211 90.5827 20.7959 88.9318 20.7959C87.3167 20.7959 85.7017 20.5862 83.9431 20.2715ZM93.2027 17.929L89.0035 6.84589L84.8044 17.964C86.3477 18.2087 87.6397 18.3486 88.8959 18.3486C90.2238 18.3136 91.5876 18.1737 93.2027 17.929Z" />
        <path d="M105.082 24.9215C102.498 24.9215 100.847 23.7328 100.847 20.9008V3H103.575V20.5512C103.575 21.9497 104.508 22.4391 105.692 22.4391C105.979 22.4391 106.159 22.4391 106.482 22.4042V24.7816C106.266 24.8516 105.8 24.9215 105.082 24.9215Z" />
        <path d="M110.501 3.52444C111.614 3.52444 112.404 4.18873 112.404 5.37745C112.404 6.53121 111.614 7.23046 110.501 7.23046C109.389 7.23046 108.599 6.56618 108.599 5.37745C108.599 4.18873 109.389 3.52444 110.501 3.52444ZM109.102 9.4331H111.829V24.8166H109.102V9.4331Z" />
        <path d="M126.58 22.0546C125.575 24.0824 123.673 25.1313 121.233 25.1313C117.069 25.1313 114.988 21.67 114.988 17.1249C114.988 12.7895 117.177 9.11844 121.556 9.11844C123.852 9.11844 125.647 10.1324 126.58 12.1252V9.4331H129.236V23.4181C129.236 27.9283 127.047 30.97 121.412 30.97C118.756 30.97 117.321 30.6204 115.777 30.1309V27.5437C117.5 28.1031 119.33 28.4527 121.268 28.4527C125.216 28.4527 126.58 26.3899 126.58 23.523V22.0546ZM121.95 22.6489C124.391 22.6489 126.544 21.1455 126.544 17.7192V16.4955C126.544 13.0692 124.57 11.5658 122.237 11.5658C119.187 11.5658 117.608 13.5237 117.608 17.0899C117.644 20.8309 119.151 22.6489 121.95 22.6489Z" />
        <path d="M146.75 24.8166H144.023V15.5166C144.023 12.7545 142.874 11.5309 140.29 11.5309C137.778 11.5309 136.019 13.1741 136.019 16.2858V24.8516H133.292V9.46807H136.019V11.9854C137.024 10.1673 138.89 9.15341 141.008 9.15341C144.633 9.15341 146.714 11.6008 146.714 15.8312V24.8166H146.75Z" />
        <path fill="url(#${id}-1)" d="M0.75 5.78784C0.75 9.51693 3.76475 12.5581 7.46141 12.5581H13.6704V18.8578H20.3818V6.91019C20.3818 6.33091 19.9152 5.82405 19.341 5.82405L0.75 5.78784Z" />
        <path fill="url(#${id}-2)" d="M20.3459 25.5918C20.3459 21.8627 17.3311 18.8577 13.6345 18.8577H7.46141V12.5581H0.75V24.5057C0.75 25.085 1.21657 25.5918 1.79081 25.5918H20.3459Z" />
      </g>
    </svg>
  `;
  }
};

/**
 * __Jira Align logo__
 *
 * The Jira Align logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraAlignLogo = ({
  appearance,
  label = 'Jira Align',
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
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      svg={svg(
        {
          appearance,
          iconGradientStart,
          iconGradientStop,
          iconColor,
          textColor,
          size,
          label,
        },
        colorMode,
      )}
      testId={testId}
      textColor={textColor}
    />
  );
};
