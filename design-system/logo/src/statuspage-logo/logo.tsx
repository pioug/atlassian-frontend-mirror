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
    return `<svg fill="none" height="32" viewBox="0 0 188 32" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colors.iconColor}" d="M13 12.604c-3.032 0-5.98 1.37-8.39 3.489q-.373.373-.747.373c-.208 0-.416-.124-.582-.332L.25 12.562c-.167-.207-.25-.415-.25-.581 0-.25.125-.457.374-.706C4.029 8.035 8.473 6.208 13 6.208s8.971 1.827 12.626 5.067c.25.249.374.457.374.706 0 .166-.083.374-.25.581l-3.031 3.572c-.166.208-.374.332-.582.332q-.373 0-.747-.374c-2.41-2.118-5.358-3.488-8.39-3.488m0 13.374c-3.364 0-6.105-2.742-6.105-6.064S9.635 13.85 13 13.85c3.364 0 6.105 2.7 6.105 6.064s-2.74 6.063-6.105 6.063" />
      <path fill="${colors.textColor}" d="M180.293 12.293c-2.79 0-4.201 1.81-4.477 4.477h8.556c-.153-2.852-1.441-4.477-4.079-4.477m5.888 12.635c-1.257.674-3.189.92-4.753.92-5.735 0-8.249-3.312-8.249-8.004 0-4.631 2.576-7.943 7.237-7.943 4.723 0 6.624 3.281 6.624 7.943v1.196h-11.193c.368 2.606 2.054 4.293 5.673 4.293 1.779 0 3.281-.337 4.661-.828zm-18.638-.614v-1.533c-.981 2.024-2.821 3.067-5.183 3.067-4.048 0-6.072-3.466-6.072-7.974 0-4.324 2.116-7.973 6.379-7.973 2.239 0 3.956 1.012 4.876 3.005v-2.698h2.576V24.16c0 4.508-2.116 7.544-7.605 7.544-2.576 0-3.987-.337-5.459-.828V28.3c1.687.552 3.435.92 5.336.92 3.833 0 5.152-2.055 5.152-4.907m-8.679-6.44c0 3.68 1.472 5.52 4.202 5.52 2.361 0 4.477-1.503 4.477-4.906V17.26c0-3.404-1.932-4.907-4.171-4.907-2.974 0-4.508 1.963-4.508 5.52m-16.949.001c0 3.68 1.472 5.52 4.201 5.52 2.362 0 4.478-1.503 4.478-4.906V17.26c0-3.404-1.932-4.907-4.171-4.907-2.975 0-4.508 1.963-4.508 5.52m8.679 7.667v-2.76c-.982 2.024-2.822 3.066-5.183 3.066-4.079 0-6.133-3.465-6.133-7.973 0-4.324 2.146-7.973 6.44-7.973 2.238 0 3.956 1.012 4.876 3.005v-2.699h2.637V25.54zm-16.091-7.666c0-3.68-1.472-5.52-4.201-5.52-2.361 0-4.477 1.503-4.477 4.907v1.227c0 3.404 1.932 4.906 4.17 4.906 2.975 0 4.508-1.962 4.508-5.52m-3.802 7.974c-2.239 0-3.956-1.013-4.876-3.006v8.679h-2.638V10.207h2.638v2.76c.981-2.024 2.821-3.066 5.182-3.066 4.079 0 6.134 3.465 6.134 7.973 0 4.324-2.147 7.973-6.44 7.973m-10.56-4.477c0 2.545-1.656 4.477-5.765 4.477-2.3 0-4.171-.52-5.336-1.134v-2.79c1.318.766 3.526 1.502 5.458 1.502 2.024 0 3.067-.828 3.067-2.024 0-1.165-.889-1.84-3.803-2.545-3.404-.829-4.845-2.147-4.845-4.662 0-2.668 2.055-4.293 5.551-4.293 1.993 0 3.802.49 4.937 1.104v2.73c-1.84-.92-3.343-1.411-4.968-1.411-1.932 0-2.975.674-2.975 1.87 0 1.073.736 1.748 3.558 2.423 3.404.828 5.121 2.085 5.121 4.753m-27.598-2.177v-8.985h2.638v9.26c0 2.76 1.104 3.988 3.618 3.988 2.454 0 4.14-1.626 4.14-4.723v-8.525h2.638V25.54h-2.638v-2.515c-.981 1.81-2.79 2.821-4.845 2.821-3.527 0-5.55-2.422-5.55-6.654m-7.155 1.596c0 1.349.797 2.269 2.422 2.269.614 0 1.196-.123 1.656-.215v2.546a6.3 6.3 0 0 1-1.778.245c-3.282 0-4.876-1.932-4.876-4.784v-8.188h-2.484v-2.453h2.484V6.957h2.576v3.25h4.078v2.454H85.39zm-18.943-2.914c0 3.68 1.472 5.52 4.202 5.52 2.361 0 4.477-1.503 4.477-4.906V17.26c0-3.404-1.932-4.907-4.17-4.907-2.975 0-4.509 1.963-4.509 5.52m8.679 7.667v-2.76c-.981 2.024-2.821 3.066-5.183 3.066-4.078 0-6.133-3.465-6.133-7.973 0-4.324 2.147-7.973 6.44-7.973 2.239 0 3.956 1.012 4.876 3.005v-2.699h2.637V25.54zm-17.258-4.752c0 1.349.797 2.269 2.422 2.269.614 0 1.196-.123 1.656-.215v2.546a6.3 6.3 0 0 1-1.778.245c-3.282 0-4.876-1.932-4.876-4.784v-8.188h-2.484v-2.453h2.484V6.957h2.576v3.25h4.078v2.454h-4.078zm-6.894-.798c0 3.496-2.085 5.858-7.084 5.858-3.894 0-5.704-.767-7.268-1.564v-2.822c1.871.982 4.754 1.687 7.422 1.687 3.036 0 4.17-1.196 4.17-2.975 0-1.778-1.104-2.729-4.937-3.649-4.539-1.104-6.563-2.668-6.563-5.98 0-3.128 2.392-5.459 7.084-5.459 2.914 0 4.784.706 6.164 1.472v2.76c-2.024-1.165-4.201-1.533-6.286-1.533-2.638 0-4.202.92-4.202 2.76 0 1.656 1.288 2.484 4.846 3.373 4.262 1.074 6.654 2.454 6.654 6.072" />
    </svg>`;
  } else {
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ iconGradientStart: iconGradientStop });

    if (appearance) {
      colors = getColorsFromAppearanceOldLogos(appearance);
    }
    return `<svg height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161 32">
    <defs>
      <linearGradient id="${id}" x1="50%" x2="50%" y1="82.77%" y2="10.134%">
        <stop offset="0%" stop-color="${colors.iconGradientStop}" />
        <stop offset="82%" stop-color="${colors.iconGradientStart}" ${
      colors.iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
    } />
      </linearGradient>
    </defs>
    <g fill-rule="evenodd">
      <path fill="${
        colors.textColor
      }" fill-rule="nonzero" d="M44.168,18.294 C44.168,15.226 42.14,14.056 38.526,13.146 C35.51,12.392 34.418,11.69 34.418,10.286 C34.418,8.726 35.744,7.946 37.98,7.946 C39.748,7.946 41.594,8.258 43.31,9.246 L43.31,6.906 C42.14,6.256 40.554,5.658 38.084,5.658 C34.106,5.658 32.078,7.634 32.078,10.286 C32.078,13.094 33.794,14.42 37.642,15.356 C40.892,16.136 41.828,16.942 41.828,18.45 C41.828,19.958 40.866,20.972 38.292,20.972 C36.03,20.972 33.586,20.374 32,19.542 L32,21.934 C33.326,22.61 34.86,23.26 38.162,23.26 C42.4,23.26 44.168,21.258 44.168,18.294 Z M50.018,18.892 L50.018,12.08 L53.476,12.08 L53.476,10 L50.018,10 L50.018,7.244 L47.834,7.244 L47.834,10 L45.728,10 L45.728,12.08 L47.834,12.08 L47.834,18.944 C47.834,21.362 49.186,23 51.968,23 C52.644,23 53.086,22.896 53.476,22.792 L53.476,20.634 C53.086,20.712 52.592,20.816 52.072,20.816 C50.694,20.816 50.018,20.036 50.018,18.892 Z M65.15,23 L65.15,20.66 C64.318,22.376 62.758,23.26 60.756,23.26 C57.298,23.26 55.556,20.322 55.556,16.5 C55.556,12.834 57.376,9.74 61.016,9.74 C62.914,9.74 64.37,10.598 65.15,12.288 L65.15,10 L67.386,10 L67.386,23 L65.15,23 Z M57.792,16.5 C57.792,19.62 59.04,21.18 61.354,21.18 C63.356,21.18 65.15,19.906 65.15,17.02 L65.15,15.98 C65.15,13.094 63.512,11.82 61.614,11.82 C59.092,11.82 57.792,13.484 57.792,16.5 Z M73.86,18.892 L73.86,12.08 L77.318,12.08 L77.318,10 L73.86,10 L73.86,7.244 L71.676,7.244 L71.676,10 L69.57,10 L69.57,12.08 L71.676,12.08 L71.676,18.944 C71.676,21.362 73.028,23 75.81,23 C76.486,23 76.928,22.896 77.318,22.792 L77.318,20.634 C76.928,20.712 76.434,20.816 75.914,20.816 C74.536,20.816 73.86,20.036 73.86,18.892 Z M79.918,17.618 C79.918,21.206 81.634,23.26 84.624,23.26 C86.366,23.26 87.9,22.402 88.732,20.868 L88.732,23 L90.968,23 L90.968,10 L88.732,10 L88.732,17.228 C88.732,19.854 87.302,21.232 85.222,21.232 C83.09,21.232 82.154,20.192 82.154,17.852 L82.154,10 L79.918,10 L79.918,17.618 Z M103.318,19.464 C103.318,17.202 101.862,16.136 98.976,15.434 C96.584,14.862 95.96,14.29 95.96,13.38 C95.96,12.366 96.844,11.794 98.482,11.794 C99.86,11.794 101.134,12.21 102.694,12.99 L102.694,10.676 C101.732,10.156 100.198,9.74 98.508,9.74 C95.544,9.74 93.802,11.118 93.802,13.38 C93.802,15.512 95.024,16.63 97.91,17.332 C100.38,17.93 101.134,18.502 101.134,19.49 C101.134,20.504 100.25,21.206 98.534,21.206 C96.896,21.206 95.024,20.582 93.906,19.932 L93.906,22.298 C94.894,22.818 96.48,23.26 98.43,23.26 C101.914,23.26 103.318,21.622 103.318,19.464 Z M112.262,23.26 C110.364,23.26 108.908,22.402 108.128,20.712 L108.128,28.07 L105.892,28.07 L105.892,10 L108.128,10 L108.128,12.34 C108.96,10.624 110.52,9.74 112.522,9.74 C115.98,9.74 117.722,12.678 117.722,16.5 C117.722,20.166 115.902,23.26 112.262,23.26 Z M115.486,16.5 C115.486,13.38 114.238,11.82 111.924,11.82 C109.922,11.82 108.128,13.094 108.128,15.98 L108.128,17.02 C108.128,19.906 109.766,21.18 111.664,21.18 C114.186,21.18 115.486,19.516 115.486,16.5 Z M129.136,23 L129.136,20.66 C128.304,22.376 126.744,23.26 124.742,23.26 C121.284,23.26 119.542,20.322 119.542,16.5 C119.542,12.834 121.362,9.74 125.002,9.74 C126.9,9.74 128.356,10.598 129.136,12.288 L129.136,10 L131.372,10 L131.372,23 L129.136,23 Z M121.778,16.5 C121.778,19.62 123.026,21.18 125.34,21.18 C127.342,21.18 129.136,19.906 129.136,17.02 L129.136,15.98 C129.136,13.094 127.498,11.82 125.6,11.82 C123.078,11.82 121.778,13.484 121.778,16.5 Z M143.514,21.96 L143.514,20.66 C142.682,22.376 141.122,23.26 139.12,23.26 C135.688,23.26 133.972,20.322 133.972,16.5 C133.972,12.834 135.766,9.74 139.38,9.74 C141.278,9.74 142.734,10.598 143.514,12.288 L143.514,10 L145.698,10 L145.698,21.83 C145.698,25.652 143.904,28.226 139.25,28.226 C137.066,28.226 135.87,27.94 134.622,27.524 L134.622,25.34 C136.052,25.808 137.534,26.12 139.146,26.12 C142.396,26.12 143.514,24.378 143.514,21.96 Z M136.156,16.5 C136.156,19.62 137.404,21.18 139.718,21.18 C141.72,21.18 143.514,19.906 143.514,17.02 L143.514,15.98 C143.514,13.094 141.876,11.82 139.978,11.82 C137.456,11.82 136.156,13.484 136.156,16.5 Z M159.322,22.48 C158.256,23.052 156.618,23.26 155.292,23.26 C150.43,23.26 148.298,20.452 148.298,16.474 C148.298,12.548 150.482,9.74 154.434,9.74 C158.438,9.74 160.05,12.522 160.05,16.474 L160.05,17.488 L150.56,17.488 C150.872,19.698 152.302,21.128 155.37,21.128 C156.878,21.128 158.152,20.842 159.322,20.426 L159.322,22.48 Z M154.33,11.768 C151.964,11.768 150.768,13.302 150.534,15.564 L157.788,15.564 C157.658,13.146 156.566,11.768 154.33,11.768 Z"/>
      <circle cx="12" cy="18.923" r="5.538" fill="url(#${id})" fill-rule="nonzero"/>
      <path fill="${
        colors.iconColor
      }" fill-rule="nonzero" d="M0.143183246,11.470217 L3.17443341,15.0164923 C3.40520779,15.2738906 3.80165918,15.3034375 4.06900618,15.0831635 C8.96019542,10.7622319 15.0323494,10.7622319 19.9235386,15.0831635 C20.1908857,15.3034375 20.5873371,15.2738906 20.8181114,15.0164923 L23.8525794,11.470217 C24.0663737,11.214892 24.04536,10.8403265 23.8043112,10.6098404 C16.6927794,4.46338652 7.29976539,4.46338652 0.201105223,10.6098404 C-0.042871755,10.8377486 -0.0680989446,11.2124749 0.143183246,11.470217 Z"/>
    </g>
  </svg>`;
  }
};

/**
 * __Statuspage logo__
 *
 * The Statuspage logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const StatuspageLogo = ({
  appearance,
  label = 'Statuspage',
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
        },
        colorMode,
      )}
      testId={testId}
      textColor={textColor}
    />
  );
};
