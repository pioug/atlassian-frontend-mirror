/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({
  appearance,
  iconGradientStart,
  iconGradientStop,
  iconColor,
  textColor,
}: LogoProps) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
    textColor,
  };
  // Will be fixed upon removal of deprecated iconGradientStart and
  // iconGradientStop props, or with React 18's useId() hook when we update.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  let id = uid({ iconGradientStart: iconGradientStop });

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
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
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      iconColor={iconColor}
      iconGradientStart={iconGradientStart}
      iconGradientStop={iconGradientStop}
      size={size}
      svg={svg({
        appearance,
        iconGradientStart,
        iconGradientStop,
        iconColor,
        textColor,
        size,
        label,
      })}
      testId={testId}
      textColor={textColor}
    />
  );
};
