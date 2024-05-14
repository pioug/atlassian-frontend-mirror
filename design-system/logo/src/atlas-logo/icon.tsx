/* eslint-disable max-len */
import React from 'react';

import { uid } from 'react-uid';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { B400 } from '@atlaskit/theme/colors';
import { useThemeObserver } from '@atlaskit/tokens';

import { defaultLogoParams } from '../constants';
import { type LogoProps, type LogoPropsAppearanceRequired } from '../types';
import { getColorsFromAppearance } from '../utils';
import Wrapper from '../wrapper';

const svg = ({ appearance }: LogoProps, colorMode: string | undefined) => {
  if (
    getBooleanFF(
      'platform.design-system-team.brand-refresh-update-product-logos_q7coo',
    )
  ) {
    let colors = getColorsFromAppearance(
      appearance ? appearance : 'brand',
      colorMode,
    );
    return `<svg viewBox="0 0 32 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="${colors.iconColor}">
      <path d="M16 28.532c-6.656 0-12.068-5.412-12.068-12.068S9.344 4.396 16 4.396v1.921c-5.597 0-10.146 4.549-10.146 10.146S10.403 26.609 16 26.609zm0 0v-1.921c5.597 0 10.146-4.549 10.146-10.146h1.921c0 6.656-5.412 12.068-12.068 12.068zm12.068-12.068h-1.921c0-5.597-4.549-10.146-10.146-10.146V4.397c6.656 0 12.068 5.412 12.068 12.068zm-6.928 3.695c-1.28-.251-2.292-.706-3.973-1.467-.464-.204-.974-.436-1.559-.696a59 59 0 0 0-1.003-.436c-2.534-1.123-3.926-1.736-5.634-1.736-1.198 0-2.098.325-2.6.937a1.72 1.72 0 0 0-.38 1.448l-1.885.362a3.67 3.67 0 0 1 .78-3.035c.613-.743 1.82-1.634 4.085-1.634 2.116 0 3.824.761 6.414 1.903.316.14.641.288.994.436.594.26 1.114.492 1.578.706 1.606.724 2.488 1.123 3.555 1.327l-.371 1.885Zm1.877.185c-.64 0-1.253-.056-1.875-.185l.371-1.885c.502.102.994.149 1.504.149 1.188 0 2.089-.298 2.609-.864s.539-1.253.51-1.615l1.913-.167c.102 1.169-.251 2.265-1.003 3.082-.622.677-1.82 1.485-4.029 1.485M16 28.532v-1.921c2.757 0 4.4-2.813 4.4-7.52s-1.67-8.652-5.096-12.3l1.402-1.318c3.778 4.02 5.616 8.476 5.616 13.618 0 5.821-2.423 9.441-6.322 9.441m-.001 0c-4.15 0-6.526-3.379-6.526-9.273 0-6.879 3.008-10.722 5.82-13.776l1.412 1.299c-3.277 3.565-5.31 6.888-5.31 12.476 0 6.08 2.506 7.352 4.604 7.352z"/>
      <path d="M10.857 17.467a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494m10.385 3.871a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494M15.998 7.96a2.247 2.247 0 1 0 0-4.493 2.247 2.247 0 0 0 0 4.494Z"/>
    </g>
  </svg>`;
  } else {
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ appearance });

    // Brand
    let colors = {
      iconGradientStart: '#1D7AFC',
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconGradientMid: B400,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconGradientStop: B400,
    };

    if (appearance === 'neutral') {
      colors = {
        iconGradientStart: '#758195',
        iconGradientMid: '#596A85',
        iconGradientStop: '#2C3E5D',
      };
    }

    const baseIconContents = `
    <linearGradient
      id="${id}-a"
      gradientUnits="userSpaceOnUse"
      x1="10.6592"
      x2="9.74055"
      y1="28.7353"
      y2="4.626"
    >
      <stop offset=".5" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient id="${id}-b">
      <stop offset="0" stop-color="${colors.iconGradientMid}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-c"
      gradientUnits="userSpaceOnUse"
      x1="28.2733"
      x2="17.5886"
      xlink:href="#${id}-b"
      y1="17.5235"
      y2="28.5702"
    />
    <linearGradient
      id="${id}-d"
      gradientUnits="userSpaceOnUse"
      x1="22.0338"
      x2="22.0338"
      y1="4.39582"
      y2="16.4638"
    >
      <stop offset="0" stop-color="${colors.iconGradientStart}" />
      <stop offset=".59" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-e"
      gradientUnits="userSpaceOnUse"
      x1="4.04047"
      x2="21.5118"
      y1="17.0305"
      y2="17.0305"
    >
      <stop offset=".26" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-f"
      gradientUnits="userSpaceOnUse"
      x1="23.0712"
      x2="26.8865"
      xlink:href="#${id}-b"
      y1="19.8515"
      y2="15.7949"
    />
    <linearGradient
      id="${id}-g"
      gradientUnits="userSpaceOnUse"
      x1="18.8126"
      x2="18.8126"
      y1="28.5318"
      y2="5.47314"
    >
      <stop offset=".36" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-h"
      gradientUnits="userSpaceOnUse"
      x1="13.0887"
      x2="13.0887"
      y1="28.5318"
      y2="5.48176"
    >
      <stop offset=".06" stop-color="${colors.iconGradientStart}" />
      <stop offset=".58" stop-color="${colors.iconGradientStop}" />
      <stop offset="1" stop-color="${colors.iconGradientStart}" />
    </linearGradient>
    <path
      d="m15.9999 28.532c-6.65602 0-12.06802-5.412-12.06802-12.068s5.412-12.068 12.06802-12.068v1.92133c-5.5973 0-10.14602 4.54867-10.14602 10.14597 0 5.5974 4.54872 10.146 10.14602 10.146v1.9214z"
      fill="url(#${id}-a)"
    />
    <path
      d="m15.9999 28.5322v-1.9214c5.5974 0 10.146-4.5486 10.146-10.146h1.9214c0 6.656-5.412 12.068-12.068 12.068z"
      fill="url(#${id}-c)"
    />
    <path
      d="m28.0678 16.4638h-1.9213c0-5.5973-4.5487-10.14598-10.146-10.14598v-1.92134c6.656 0 12.068 5.41201 12.068 12.06802z"
      fill="url(#${id}-d)"
    />
    <path
      d="m21.1405 20.1585c-1.2814-.2506-2.2927-.7053-3.9734-1.4666-.464-.204-.9746-.436-1.5593-.696-.3527-.158-.6773-.2974-1.0027-.436-2.534-1.1234-3.9266-1.736-5.63463-1.736-1.19733 0-2.098.3246-2.59933.9373-.34334.4087-.48267.9373-.38067 1.448l-1.88467.362c-.204-1.0767.074-2.1813.78-3.0353.61267-.7427 1.81934-1.634 4.08467-1.634 2.11663 0 3.82463.7613 6.41463 1.9033.3154.1393.6407.288.9934.436.594.26 1.114.492 1.578.7053 1.606.724 2.488 1.1234 3.5553 1.3274z"
      fill="url(#${id}-e)"
    />
    <path
      d="m23.0172 20.3442c-.6407 0-1.2534-.056-1.8754-.1853l.3714-1.8847c.5013.102.9933.1487 1.504.1487 1.188 0 2.0886-.2974 2.6086-.8634s.5387-1.2533.5107-1.6153l1.912-.1673c.102 1.1693-.2507 2.2653-1.0027 3.082-.622.6773-1.8193 1.4853-4.0286 1.4853z"
      fill="url(#${id}-f)"
    />
    <path
      d="m16 28.5318v-1.9213c2.7573 0 4.4-2.8127 4.4-7.5194 0-4.7066-1.6707-8.652-5.096-12.29996l1.402-1.318c3.778 4.01934 5.616 8.47536 5.616 13.61796 0 5.8207-2.4227 9.4407-6.322 9.4407z"
      fill="url(#${id}-g)"
    />
    <path
      d="m15.9987 28.5318c-4.1494 0-6.52604-3.3787-6.52604-9.2734 0-6.8786 3.00804-10.72198 5.82064-13.77598l1.4114 1.29934c-3.2767 3.56464-5.31 6.88804-5.31 12.47604 0 6.08 2.5066 7.352 4.6046 7.352v1.9213z"
      fill="url(#${id}-h)"
    />
    <g fill="${colors.iconGradientStart}">
      <path
        d="m10.8565 17.4665c1.2407 0 2.2467-1.006 2.2467-2.2467s-1.006-2.2467-2.2467-2.2467c-1.24064 0-2.24664 1.006-2.24664 2.2467s1.006 2.2467 2.24664 2.2467z"
      />
      <path
        d="m21.2418 21.3381c1.2407 0 2.2467-1.006 2.2467-2.2467s-1.006-2.2467-2.2467-2.2467-2.2467 1.006-2.2467 2.2467 1.006 2.2467 2.2467 2.2467z"
      />
      <path
        d="m15.9979 7.96062c1.2407 0 2.2467-1.006 2.2467-2.24667 0-1.24066-1.006-2.24666-2.2467-2.24666s-2.2467 1.006-2.2467 2.24666c0 1.24067 1.006 2.24667 2.2467 2.24667z"
      />
    </g>`;

    /**
     * inverse icons use transparency to achieve a certain gradient effect, requiring a different SVG structure
     */
    const inverseIconContents = `
      <linearGradient id="${id}-inverse-a" gradientUnits="userSpaceOnUse" x1="13.1575" x2="8.62613" y1="25.3248"
      y2="5.13609">
      <stop offset="0" stop-color="#fff" />
      <stop offset=".17" stop-color="#fff" stop-opacity=".91" />
      <stop offset=".5" stop-color="#fff" stop-opacity=".74" />
      <stop offset=".76" stop-color="#fff" stop-opacity=".64" />
      <stop offset=".92" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="${id}-inverse-b">
      <stop offset="0" stop-color="#fff" />
      <stop offset=".18" stop-color="#fff" stop-opacity=".91" />
      <stop offset=".55" stop-color="#fff" stop-opacity=".74" />
      <stop offset=".83" stop-color="#fff" stop-opacity=".64" />
      <stop offset="1" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="${id}-inverse-c" gradientUnits="userSpaceOnUse" x1="10.6926" x2="20.4159" xlink:href="#${id}-inverse-b"
      y1="15.0061" y2="18.9068" />
    <linearGradient id="${id}-inverse-d" gradientUnits="userSpaceOnUse" x1="22.7236" x2="20.8289" xlink:href="#${id}-inverse-b"
      y1="3.59276" y2="23.2521" />
    <linearGradient id="${id}-inverse-e" gradientUnits="userSpaceOnUse" x1="18.8186" x2="18.8186" y1="28.5366"
      y2="5.46924">    <stop offset=".1" stop-color="#fff" />
      <stop offset=".27" stop-color="#fff" stop-opacity=".91" />
      <stop offset=".59" stop-color="#fff" stop-opacity=".74" />
      <stop offset=".85" stop-color="#fff" stop-opacity=".64" />
      <stop offset="1" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="${id}-inverse-f" gradientUnits="userSpaceOnUse" x1="12.5694" x2="13.9441" y1="5.09736"
      y2="26.7354">
      <stop offset=".03" stop-color="#fff" />
      <stop offset=".1" stop-color="#fff" stop-opacity=".9" />
      <stop offset=".29" stop-color="#fff" stop-opacity=".68" />
      <stop offset=".38" stop-color="#fff" stop-opacity=".6" />
      <stop offset=".59" stop-color="#fff" stop-opacity=".6" />
      <stop offset=".65" stop-color="#fff" stop-opacity=".65" />
      <stop offset=".76" stop-color="#fff" stop-opacity=".77" />
      <stop offset=".91" stop-color="#fff" stop-opacity=".96" />
      <stop offset=".94" stop-color="#fff" />
    </linearGradient>
    <path
      d="m16.0048 6.31409v-1.922c-6.65867 0-12.07267 5.414-12.07267 12.07201 0 .6873.06533 1.356.16733 2.0153 0 .028 0 .0654.00934.0927 1.00266 5.6553 5.9433 9.9647 11.8867 9.9647v-1.922c-5.0334 0-9.22137-3.6774-10.0107-8.488-.06534-.4827.074-.9754.39-1.3654.50133-.6126 1.402-.938 2.6-.938.63133 0 1.226.0834 1.848.2507v-1.9687c-.6033-.13-1.20734-.1953-1.848-.1953-1.30934 0-2.266.2973-2.95334.6967.882-4.71738 5.02404-8.29271 9.98264-8.29271z"
      fill="url(#${id}-inverse-a)" />
    <path
      d="m17.9639 16.9475c-.464-.204-.9847-.446-1.5787-.706-.3433-.1487-.678-.2974-.9933-.4367-1.8013-.7987-3.1853-1.4113-4.5687-1.6993v1.9686c1.0494.2787 2.1914.78 3.7887 1.486.316.1394.65.288 1.0027.4367.5853.26 1.1053.492 1.56.6967 1.6806.752 2.6933 1.2073 3.9746 1.4673l.3714-1.8853c-1.068-.2134-1.95-.6034-3.5567-1.328z"
      fill="url(#${id}-inverse-c)" />
    <path
      d="m28.0683 16.2508v-.4734c-.3714-6.34264-5.6367-11.38531-12.0634-11.38531v1.922c5.5254 0 10.0294 4.42931 10.1407 9.92731-.0093.3807-.1207.882-.52 1.3187-.52.5667-1.4207.8633-2.6093.8633-.5107 0-1.0027-.0466-1.5047-.1486l-.3713 1.8853c.622.1207 1.2353.186 1.876.186 1.0586 0 1.8946-.186 2.5353-.464-1.402 3.9187-5.1633 6.7327-9.556 6.7327v1.922c6.6587 0 12.0727-5.414 12.0727-12.0727 0-.074 0-.1393 0-.2133z"
      fill="url(#${id}-inverse-d)" />
    <path
      d="m16.0046 28.5366v-1.922c2.758 0 4.402-2.814 4.402-7.522s-1.6713-8.6554-5.098-12.3047l1.402-1.31866c3.7793 4.02133 5.618 8.47866 5.618 13.62336 0 5.8226-2.424 9.4446-6.324 9.4446z"
      fill="url(#${id}-inverse-e)" />
    <path
      d="m16.0047 28.5367c-4.1513 0-6.52863-3.38-6.52863-9.2773 0-6.8814 3.00863-10.72604 5.82263-13.78137l1.4114 1.3c-3.278 3.56597-5.312 6.89067-5.312 12.48137 0 6.0826 2.5073 7.3546 4.606 7.3546v1.922z"
      fill="url(#${id}-inverse-f)" />
    <g fill="#fff">
      <path
        d="m10.8601 17.4673c1.2412 0 2.2474-1.0061 2.2474-2.2473s-1.0062-2.2473-2.2474-2.2473c-1.24114 0-2.24731 1.0061-2.24731 2.2473s1.00617 2.2473 2.24731 2.2473z" />
      <path
        d="m21.2512 21.3399c1.2412 0 2.2474-1.0062 2.2474-2.2474 0-1.2411-1.0062-2.2473-2.2474-2.2473-1.2411 0-2.2473 1.0062-2.2473 2.2473 0 1.2412 1.0062 2.2474 2.2473 2.2474z" />
      <path
        d="m16.0047 7.95805c1.2411 0 2.2473-1.00617 2.2473-2.24734s-1.0062-2.24733-2.2473-2.24733c-1.2412 0-2.2474 1.00616-2.2474 2.24733s1.0062 2.24734 2.2474 2.24734z" />
    </g>`;

    return `<svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    ${appearance === 'inverse' ? inverseIconContents : baseIconContents}
  </svg>`;
  }
};

/**
 * __Atlas logo__
 *
 * The Atlas icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AtlasIcon = ({
  appearance,
  label = 'Atlas',
  size = defaultLogoParams.size,
  testId,
}: LogoPropsAppearanceRequired) => {
  const { colorMode } = useThemeObserver();
  return (
    <Wrapper
      appearance={appearance}
      label={label}
      svg={svg(
        {
          appearance,
        },
        colorMode,
      )}
      size={size}
      testId={testId}
    />
  );
};
