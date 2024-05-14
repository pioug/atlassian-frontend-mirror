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
    // We treat the word "Atlassian" differently to normal product logos, it has a bold brand look
    atlassianLogoTextColor: textColor,
  };

  if (
    getBooleanFF(
      'platform.design-system-team.brand-refresh-update-product-logos_q7coo',
    )
  ) {
    if (appearance) {
      colors = getColorsFromAppearance(appearance, colorMode);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198 32" focusable="false" aria-hidden="true" height="32" fill="none">
      <path fill=${colors.iconColor} d="M22.878 24.378 12.293 3.208c-.208-.458-.416-.541-.666-.541-.209 0-.459.083-.709.5-1.5 2.375-2.167 5.125-2.167 8 0 4.001 2.042 7.752 5.043 13.794.333.667.583.792 1.166.792h7.335c.542 0 .833-.208.833-.625 0-.208-.041-.333-.25-.75M7.501 14.377c-.833-1.25-1.083-1.334-1.292-1.334s-.333.083-.708.834L.208 24.46c-.166.334-.208.459-.208.625 0 .334.292.667.917.667h7.46c.5 0 .874-.416 1.083-1.208.25-1 .333-1.876.333-2.917 0-2.917-1.292-5.751-2.292-7.251z"/>
      <path fill=${colors.atlassianLogoTextColor} d="M107.447 10.828c0 2.972 1.345 5.308 6.795 6.37 3.185.707 3.893 1.203 3.893 2.265 0 1.061-.708 1.698-2.973 1.698-2.619 0-5.733-.92-7.785-2.123v4.813c1.627.778 3.751 1.698 7.785 1.698 5.662 0 7.856-2.548 7.856-6.228m0 .07c0-3.538-1.84-5.166-7.148-6.298-2.902-.637-3.61-1.274-3.61-2.194 0-1.133 1.062-1.628 2.973-1.628 2.335 0 4.6.708 6.794 1.698v-4.6c-1.557-.779-3.892-1.345-6.653-1.345-5.237 0-7.927 2.265-7.927 5.945m72.475-5.803v20.17h4.318V9.979l1.769 4.035 6.087 11.324h5.379V5.166h-4.247v13.022l-1.628-3.821-4.883-9.201zm-27.319 0h-4.671v20.17h4.671zm-10.05 14.154c0-3.538-1.841-5.166-7.149-6.298-2.902-.637-3.609-1.274-3.609-2.194 0-1.133 1.061-1.628 2.972-1.628 2.336 0 4.601.708 6.795 1.699v-4.6c-1.557-.78-3.893-1.346-6.653-1.346-5.238 0-7.927 2.265-7.927 5.946 0 2.972 1.344 5.308 6.794 6.37 3.185.707 3.893 1.203 3.893 2.264 0 1.062-.708 1.699-2.973 1.699-2.618 0-5.733-.92-7.785-2.123v4.812c1.628.779 3.751 1.699 7.785 1.699 5.592 0 7.857-2.548 7.857-6.3M71.069 5.166v20.17h9.625l1.486-4.387h-6.44V5.166zm-19.039 0v4.317h5.167v15.854h4.741V9.483h5.592V5.166zm-6.866 0h-6.157L32 25.336h5.379l.99-3.396c1.204.353 2.478.566 3.752.566s2.548-.213 3.751-.567l.991 3.398h5.379c-.07 0-7.078-20.171-7.078-20.171M42.05 18.259c-.92 0-1.77-.141-2.548-.354L42.05 9.13l2.548 8.776a9.6 9.6 0 0 1-2.548.354zM97.326 5.166H91.17l-7.078 20.17h5.38l.99-3.396c1.203.353 2.477.566 3.751.566s2.548-.213 3.751-.567l.991 3.398h5.379zm-3.114 13.093c-.92 0-1.77-.141-2.548-.354l2.548-8.776 2.548 8.776a9.6 9.6 0 0 1-2.548.354m75.306-13.093h-6.157l-7.007 20.17h5.379l.991-3.396c1.203.353 2.477.566 3.751.566s2.548-.213 3.751-.567l.991 3.398h5.379zm-3.043 13.093c-.92 0-1.77-.141-2.548-.354l2.548-8.776 2.548 8.776a10 10 0 0 1-2.548.354"/>
    </svg>`;
  } else {
    if (appearance) {
      colors = getColorsFromAppearanceOldLogos(appearance);
    }
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ iconGradientStart: iconGradientStop });
    return `
      <svg viewBox="0 0 190 32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient x1="99.684716%" y1="15.8138128%" x2="39.8444399%" y2="97.4388388%" id="${id}">
            <stop stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } offset="0%"></stop>
            <stop stop-color="${colors.iconGradientStop}" offset="100%"></stop>
          </linearGradient>
        </defs>
        <g stroke="none" stroke-width="1" fill="${
          colors.atlassianLogoTextColor
        }" >
          <path fill="url(#${id})" d="M6.90502605,15.6123193 C6.76436383,15.4302139 6.53773035,15.3340846 6.30742588,15.35884 C6.0771214,15.3835955 5.876643,15.525635 5.7787929,15.7333781 L0.0719979599,27.0218487 C-0.0337056449,27.2310259 -0.0224063827,27.4794358 0.101860917,27.6783741 C0.226128216,27.8773125 0.445645594,27.9984148 0.68202605,27.9984369 L8.62844459,27.9984369 C8.88847261,28.0044096 9.12761649,27.8581627 9.23847268,27.6253781 C10.9526159,24.1210252 9.91378448,18.7926722 6.90502605,15.6123193 Z"></path>
          <path fill="${
            colors.iconColor
          }" d="M11.0859556,5.33713587 C8.19309829,9.74089822 7.85921851,15.3267488 10.2073011,20.0371359 L14.0383488,27.6176065 C14.1538739,27.8462194 14.3900332,27.9906411 14.6483769,27.9906653 L22.5933685,27.9906653 C22.829749,27.9906431 23.0492663,27.8695408 23.1735336,27.6706025 C23.2978009,27.4716641 23.3091002,27.2232543 23.2033966,27.014077 C23.2033966,27.014077 12.5147056,5.8619594 12.2460792,5.33290058 C12.1377032,5.11315026 11.9118188,4.97410225 11.6646746,4.97500451 C11.4175304,4.97590676 11.1926893,5.11660025 11.0859556,5.33713587 L11.0859556,5.33713587 Z"></path>
          <path d="M104.2774,14.3919316 C104.2774,17.1872257 105.588069,19.4065198 110.714802,20.3862846 C113.773504,21.0215787 114.414212,21.5100493 114.414212,22.5187551 C114.414212,23.4985198 113.772077,24.1327551 111.617715,24.1327551 C109.013896,24.0864379 106.462135,23.403307 104.189999,22.1442846 L104.189999,26.6972257 C105.733976,27.4465198 107.772754,28.2822846 111.559566,28.2822846 C116.919251,28.2822846 119.045788,25.9175787 119.045788,22.4033434 M119.045788,22.4033434 C119.045788,19.0892257 117.268858,17.5327551 112.25878,16.4668728 C109.491535,15.8615787 108.821574,15.2566375 108.821574,14.3919316 C108.821574,13.297814 109.811889,12.835814 111.646968,12.835814 C113.860906,12.835814 116.045591,13.4986375 118.113622,14.4208728 L118.113622,10.0691081 C116.130615,9.17615406 113.970906,8.73311319 111.792518,8.7724022 C106.840589,8.7724022 104.2774,10.9048728 104.2774,14.3919316" fill="inherit"></path>
          <polygon fill="inherit" points="173.129997 9.07000017 173.129997 28.0038825 177.20791 28.0038825 177.20791 13.5657649 178.926691 17.3983531 184.694132 28.0038825 189.820865 28.0038825 189.820865 9.07000017 185.742952 9.07000017 185.742952 21.2891766 184.198975 17.7442355 179.567399 9.07000017"></polygon>
          <rect fill="inherit" x="142.740005" y="9.07000017" width="4.45677247" height="18.9338824"></rect>
          <path d="M137.600792,22.4033434 C137.600792,19.0892257 135.823862,17.5327551 130.813784,16.4668728 C128.046539,15.8615787 127.376579,15.2566375 127.376579,14.3919316 C127.376579,13.297814 128.366893,12.835814 130.201972,12.835814 C132.41591,12.835814 134.600595,13.4986375 136.668626,14.4208728 L136.668626,10.0691081 C134.685619,9.17615406 132.52591,8.73311319 130.347522,8.7724022 C125.395593,8.7724022 122.832404,10.9048728 122.832404,14.3919316 C122.832404,17.1872257 124.143073,19.4065198 129.269806,20.3862846 C132.328508,21.0215787 132.969216,21.5100493 132.969216,22.5187551 C132.969216,23.4985198 132.327081,24.1327551 130.172719,24.1327551 C127.568901,24.0864379 125.017139,23.403307 122.745003,22.1442846 L122.745003,26.6972257 C124.28898,27.4465198 126.327758,28.2822846 130.11457,28.2822846 C135.474256,28.2822846 137.600792,25.9175787 137.600792,22.4033434" fill="inherit"></path>
          <polygon fill="inherit" points="69.6599979 9.07000017 69.6599979 28.0038825 78.8204081 28.0038825 80.2627142 23.9115296 74.1456665 23.9115296 74.1456665 9.07000017"></polygon>
          <polygon fill="inherit" points="51.5549984 9.07000017 51.5549984 13.1620002 56.5069282 13.1620002 56.5069282 28.0038825 60.9925967 28.0038825 60.9925967 13.1620002 66.2941332 13.1620002 66.2941332 9.07000017"></polygon>
          <path d="M45.0573091,9.07000017 L39.1785647,9.07000017 L32.5050001,28.0038825 L37.6014102,28.0038825 L38.5474889,24.815059 C40.877531,25.4919503 43.3551322,25.4919503 45.6851743,24.815059 L46.6312529,28.0038825 L51.7287333,28.0038825 L45.0573091,9.07000017 Z M42.1177585,21.4007061 C41.287584,21.4006584 40.4616854,21.2831148 39.6651602,21.0516472 L42.1177585,12.7889413 L44.5703569,21.0544708 C43.7736914,21.2849831 42.9477956,21.4015755 42.1177585,21.4007061 L42.1177585,21.4007061 Z" fill="inherit"></path>
          <path d="M94.6019534,9.07000017 L88.7235658,9.07000017 L82.0500011,28.0038825 L87.1474815,28.0038825 L88.0935601,24.815059 C90.4236023,25.4919503 92.9012034,25.4919503 95.2312455,24.815059 L96.1773242,28.0038825 L101.274805,28.0038825 L94.6019534,9.07000017 Z M91.6627596,21.4007061 C90.8325851,21.4006584 90.0066865,21.2831148 89.2101613,21.0516472 L91.6627596,12.7889413 L94.1153579,21.0544708 C93.3186924,21.2849831 92.4927966,21.4015755 91.6627596,21.4007061 L91.6627596,21.4007061 Z" fill="inherit"></path>
          <path d="M163.256954,9.07000017 L157.378566,9.07000017 L150.705002,28.0038825 L155.802482,28.0038825 L156.748561,24.815059 C159.078603,25.4919503 161.556204,25.4919503 163.886246,24.815059 L164.832325,28.0038825 L169.930162,28.0038825 L163.256954,9.07000017 Z M160.315977,21.4007061 C159.485802,21.4006584 158.659903,21.2831148 157.863378,21.0516472 L160.315977,12.7889413 L162.768575,21.0544708 C161.971909,21.2849831 161.146014,21.4015755 160.315977,21.4007061 L160.315977,21.4007061 Z" fill="inherit"></path>
        </g>
      </svg>`;
  }
};

/**
 * __Atlassian logo__
 *
 * The Atlassian logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlassianLogo = ({
  appearance,
  label = 'Atlassian',
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
          textColor,
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
