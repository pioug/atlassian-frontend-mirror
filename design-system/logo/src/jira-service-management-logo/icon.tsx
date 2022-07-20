/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { defaultLogoParams } from '../constants';
import { LogoProps } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({
  appearance,
  size,
  iconGradientStart,
  iconGradientStop,
  iconColor,
}: LogoProps) => {
  let colors = {
    iconGradientStart,
    iconGradientStop,
    iconColor,
  };
  let id = uid({ iconGradientStart: iconGradientStop });

  if (appearance) {
    colors = getColorsFromAppearance(appearance);
    id = `jsmIcon-${appearance}`;
  }

  return `
  <svg viewBox="0 0 32 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="40.063%" x2="69.955%" y1="0%" y2="50%" id="${id}">
        <stop stop-color="${colors.iconGradientStart}" ${
    colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path fill="url(#${id})" d="M18.4838727,13.07 L26.3504842,13.1005351 C26.8138769,13.102696 27.2364009,13.3661074 27.4423455,13.781227 C27.64829,14.1963467 27.6024124,14.6921363 27.3237913,15.0624169 L15.7128101,30.5666265 C13.9597489,29.2574035 12.7986975,27.3052951 12.485161,25.1398891 C12.1716246,22.974483 12.731296,20.7732253 14.041012,19.0205325 L18.4838727,13.07 Z"></path>
      <path fill="${
        colors.iconColor
      }" d="M14.0396053,19.0156579 L6.22105263,18.9660526 C5.75779361,18.9638923 5.33539149,18.700557 5.12950634,18.2855571 C4.92362119,17.8705572 4.96948557,17.3749106 5.24802632,17.0047368 L16.7411842,1.65 C18.4937397,2.9588453 19.6544561,4.91039056 19.9679021,7.0751719 C20.2813481,9.23995324 19.7218382,11.4405759 18.4125,13.1927632 L14.0396053,19.0156579 Z"></path>
    </g>
  </svg>`;
};

export const JiraServiceManagementIcon = ({
  appearance,
  label = 'Jira Service Management',
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
        label,
        size,
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
