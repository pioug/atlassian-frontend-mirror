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
    return `<svg viewBox="0 0 102 32" focusable="false" aria-hidden="true" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.068 27.865C5.412 27.865 0 22.453 0 15.797S5.412 3.73 12.068 3.73v1.922c-5.597 0-10.146 4.548-10.146 10.146 0 5.597 4.549 10.145 10.146 10.145z M12.068 27.865v-1.92c5.597 0 10.146-4.55 10.146-10.147h1.921c0 6.656-5.412 12.068-12.068 12.068h.001Zm12.068-12.068h-1.921c0-5.597-4.549-10.146-10.146-10.146V3.73c6.656 0 12.068 5.412 12.068 12.068zm-6.927 3.695c-1.282-.25-2.293-.705-3.974-1.466-.464-.204-.974-.436-1.559-.696a58 58 0 0 0-1.003-.436C8.14 15.77 6.747 15.158 5.04 15.158c-1.198 0-2.098.324-2.6.937a1.72 1.72 0 0 0-.38 1.448l-1.885.362a3.67 3.67 0 0 1 .78-3.035c.613-.743 1.82-1.634 4.085-1.634 2.116 0 3.824.761 6.414 1.903.316.14.641.288.994.436.594.26 1.114.492 1.578.705 1.606.724 2.488 1.124 3.555 1.328l-.371 1.884Z M19.085 19.677c-.64 0-1.253-.056-1.875-.185l.371-1.885c.502.102.994.15 1.504.15 1.188 0 2.089-.298 2.609-.864s.539-1.254.51-1.616l1.913-.167c.102 1.17-.251 2.265-1.003 3.082-.622.677-1.82 1.485-4.029 1.485 M12.068 27.865v-1.92c2.757 0 4.4-2.814 4.4-7.52 0-4.707-1.67-8.652-5.096-12.3l1.402-1.318c3.778 4.02 5.616 8.475 5.616 13.618 0 5.82-2.423 9.44-6.322 9.44 M12.067 27.866c-4.15 0-6.526-3.379-6.526-9.274 0-6.878 3.008-10.722 5.82-13.776l1.412 1.3c-3.277 3.564-5.31 6.888-5.31 12.476 0 6.08 2.506 7.352 4.604 7.352v1.921Z" fill="${colors.iconColor}"/>
      <path d="M6.925 16.8a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494m10.385 3.872a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494M12.066 7.294a2.247 2.247 0 1 0 0-4.494 2.247 2.247 0 0 0 0 4.494" fill="${colors.iconColor}"/>
      <path d="M101.019 21.163c0 2.545-1.656 4.477-5.766 4.477-2.3 0-4.17-.521-5.336-1.135v-2.79c1.319.766 3.527 1.502 5.459 1.502 2.024 0 3.067-.828 3.067-2.024 0-1.165-.89-1.84-3.803-2.545-3.404-.828-4.845-2.147-4.845-4.661 0-2.668 2.054-4.294 5.55-4.294 1.994 0 3.803.491 4.938 1.104v2.73c-1.84-.92-3.343-1.411-4.968-1.411-1.932 0-2.975.675-2.975 1.87 0 1.074.736 1.749 3.557 2.423 3.404.828 5.122 2.086 5.122 4.754m-25.873-3.496c0 3.68 1.472 5.52 4.2 5.52 2.362 0 4.478-1.503 4.478-4.907v-1.227c0-3.404-1.932-4.906-4.17-4.906-2.975 0-4.508 1.962-4.508 5.52m8.678 7.666v-2.76c-.981 2.024-2.821 3.067-5.182 3.067-4.08 0-6.134-3.465-6.134-7.973 0-4.324 2.147-7.974 6.44-7.974 2.239 0 3.956 1.012 4.876 3.006V10h2.638v15.333zm-12.784-.03c-.214.061-.674.122-1.349.122-2.514 0-4.11-1.196-4.11-4.017V3.591h2.638V21.1c0 1.38.92 1.871 2.055 1.871.276 0 .46 0 .767-.03v2.36ZM58.12 20.58c0 1.35.798 2.27 2.423 2.27.614 0 1.196-.123 1.656-.215v2.545a6.3 6.3 0 0 1-1.779.245c-3.28 0-4.876-1.932-4.876-4.784v-8.188h-2.483V10h2.483V6.75h2.577V10h4.078v2.453h-4.078v8.127Zm-14.675.736c-1.533 0-3.097-.184-4.814-.521l-1.687 4.538h-3.097l7.942-20.148h3.496l7.943 20.148h-3.097l-1.687-4.569c-1.81.368-3.373.552-4.999.552m0-2.453c1.288 0 2.607-.154 4.171-.399l-4.079-11.04-4.078 11.07c1.502.246 2.76.369 3.986.369" fill="${colors.textColor}"/>
    </svg>`;
  } else {
    // Will be fixed upon removal of deprecated iconGradientStart and
    // iconGradientStop props, or with React 18's useId() hook when we update.
    // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
    let id = uid({ appearance });
    // Brand
    let colors = {
      iconGradientStart: '#1d7afc',
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconGradientStop: B400,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      textColor: B400,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      iconGradientMid: B400,
    };

    if (appearance === 'neutral') {
      colors = {
        iconGradientStart: '#758195',
        iconGradientStop: '#2c3e5d',
        textColor: '#758195',
        iconGradientMid: '#596a85',
      };
    }
    const baseIconContents = `
    <linearGradient
      id="${id}-a"
      gradientUnits="userSpaceOnUse"
      x1="6.72733"
      x2="5.808"
      y1="28.2142"
      y2="4.10482"
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
      x1="24.3414"
      x2="13.6567"
      xlink:href="#${id}-b"
      y1="17.0027"
      y2="28.0494"
    />
    <linearGradient
      id="${id}-d"
      gradientUnits="userSpaceOnUse"
      x1="18.1021"
      x2="18.1021"
      y1="3.87549"
      y2="15.9428"
    >
      <stop offset="0" stop-color="${colors.iconGradientStart}" />
      <stop offset=".59" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-e"
      gradientUnits="userSpaceOnUse"
      x1=".108585"
      x2="17.5793"
      y1="16.5093"
      y2="16.5093"
    >
      <stop offset=".26" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-f"
      gradientUnits="userSpaceOnUse"
      x1="19.1392"
      x2="22.9546"
      xlink:href="#${id}-b"
      y1="19.33"
      y2="15.2734"
    />
    <linearGradient
      id="${id}-g"
      gradientUnits="userSpaceOnUse"
      x1="14.8807"
      x2="14.8807"
      y1="28.0108"
      y2="4.95215"
    >
      <stop offset=".36" stop-color="${colors.iconGradientStart}" />
      <stop offset="1" stop-color="${colors.iconGradientStop}" />
    </linearGradient>
    <linearGradient
      id="${id}-h"
      gradientUnits="userSpaceOnUse"
      x1="9.15677"
      x2="9.15677"
      y1="28.0108"
      y2="4.96143"
    >
      <stop offset=".06" stop-color="${colors.iconGradientStart}" />
      <stop offset=".58" stop-color="${colors.iconGradientStop}" />
      <stop offset="1" stop-color="${colors.iconGradientStart}" />
    </linearGradient>
    <linearGradient id="${id}-i">
      <stop offset="0" stop-color="${colors.iconGradientStop}" />
      <stop offset="1" stop-color="${colors.iconGradientStart}" />
    </linearGradient>
    <linearGradient
      id="${id}-j"
      gradientUnits="userSpaceOnUse"
      x1="95.6987"
      x2="29.214"
      xlink:href="#${id}-i"
      y1="-1.89809"
      y2="20.5853"
    />
    <linearGradient
      id="${id}-k"
      gradientUnits="userSpaceOnUse"
      x1="97.0621"
      x2="30.5774"
      xlink:href="#${id}-i"
      y1="2.12082"
      y2="24.6042"
    />
    <linearGradient
      id="${id}-l"
      gradientUnits="userSpaceOnUse"
      x1="97.5167"
      x2="31.0327"
      xlink:href="#${id}-i"
      y1="3.47941"
      y2="25.9627"
    />
    <linearGradient
      id="${id}-m"
      gradientUnits="userSpaceOnUse"
      x1="101.28"
      x2="34.7954"
      xlink:href="#${id}-i"
      y1="14.583"
      y2="37.075"
    />
    <linearGradient
      id="${id}-n"
      gradientUnits="userSpaceOnUse"
      x1="99.9401"
      x2="33.4561"
      xlink:href="#${id}-i"
      y1="10.6227"
      y2="33.106"
    />
    <path
      d="m12.068 28.0108c-6.656 0-12.068-5.412-12.068-12.068 0-6.65598 5.412-12.06731 12.068-12.06731v1.92133c-5.59733 0-10.146 4.54868-10.146 10.14598 0 5.5974 4.54867 10.146 10.146 10.146v1.9214z"
      fill="url(#${id}-a)"
    />
    <path
      d="m12.068 28.0107v-1.9213c5.5974 0 10.146-4.5487 10.146-10.146h1.9214c0 6.656-5.412 12.068-12.068 12.068z"
      fill="url(#${id}-c)"
    />
    <path
      d="m24.1354 15.9428h-1.9213c0-5.5973-4.5487-10.14598-10.146-10.14598v-1.92133c6.656 0 12.068 5.412 12.068 12.06801z"
      fill="url(#${id}-d)"
    />
    <path
      d="m17.2086 19.638c-1.2813-.2507-2.2927-.7053-3.9733-1.4667-.464-.204-.9747-.436-1.5594-.696-.3526-.158-.6773-.2973-1.0026-.436-2.53405-1.1233-3.92671-1.736-5.63471-1.736-1.19734 0-2.098.3247-2.59934.9374-.34333.4086-.48266.9373-.38066 1.448l-1.884671.362c-.2040002-1.0767.074-2.1814.78-3.0354.612671-.7426 1.819331-1.634 4.084671-1.634 2.11666 0 3.82466.7614 6.41471 1.9034.3153.1393.6406.288.9933.436.594.26 1.114.492 1.578.7053 1.606.724 2.488 1.1233 3.5553 1.3273z"
      fill="url(#${id}-e)"
    />
    <path
      d="m19.0846 19.8227c-.6407 0-1.2534-.056-1.8754-.1853l.3714-1.8847c.5013.102.9933.1487 1.504.1487 1.188 0 2.0886-.2974 2.6086-.8634s.5387-1.2533.5107-1.6153l1.912-.1673c.102 1.1693-.2507 2.2653-1.0027 3.082-.622.6773-1.8193 1.4853-4.0286 1.4853z"
      fill="url(#${id}-f)"
    />
    <path
      d="m12.0681 28.0108v-1.9213c2.7573 0 4.4-2.8127 4.4-7.5194 0-4.7066-1.6707-8.65195-5.096-12.29995l1.402-1.318c3.778 4.01933 5.616 8.47535 5.616 13.61795 0 5.8207-2.4227 9.4407-6.322 9.4407z"
      fill="url(#${id}-g)"
    />
    <path
      d="m12.0668 28.0108c-4.14936 0-6.52603-3.3787-6.52603-9.2734 0-6.8786 3.008-10.72197 5.82063-13.77597l1.4114 1.29933c-3.27669 3.56467-5.31003 6.88804-5.31003 12.47604 0 6.08 2.50667 7.352 4.60463 7.352v1.9213z"
      fill="url(#${id}-h)"
    />
    <g fill="${colors.iconGradientStart}">
      <path
        d="m6.92391 16.9455c1.24067 0 2.24667-1.006 2.24667-2.2467s-1.006-2.2467-2.24667-2.2467c-1.24066 0-2.24666 1.006-2.24666 2.2467s1.006 2.2467 2.24666 2.2467z"
      />
      <path
        d="m17.3094 20.8166c1.2407 0 2.2467-1.006 2.2467-2.2467s-1.006-2.2467-2.2467-2.2467-2.2467 1.006-2.2467 2.2467 1.006 2.2467 2.2467 2.2467z"
      />
      <path
        d="m12.066 7.44011c1.2407 0 2.2467-1.006 2.2467-2.24667 0-1.24066-1.006-2.24666-2.2467-2.24666s-2.24666 1.006-2.24666 2.24666c0 1.24067 1.00596 2.24667 2.24666 2.24667z"
      />
    </g>
    <path
      d="m34.6727 21.2726-1.68 4.53h-3.0913l7.9273-20.12535h3.4907l7.9366 20.12535h-3.0913l-1.6893-4.5674c-1.81.3714-3.37.548-4.994.548-1.532 0-3.0914-.1853-4.8087-.52zm8.9767-2.33-4.0754-11.02802-4.0753 11.05602c1.504.2413 2.7573.3713 3.9827.3713 1.29 0 2.6086-.158 4.168-.3993z"
      fill="url(#${id}-j)"
    />
    <path
      d="m56.3748 23.3242c.6126 0 1.1973-.1207 1.6526-.2134v2.5434c-.464.1206-.984.2413-1.7733.2413-3.2767 0-4.8733-1.9307-4.8733-4.7807v-8.178h-2.4787v-2.4506h2.4787v-3.24938h2.5713v3.24938h4.0753v2.4506h-4.0753v8.1227c0 1.346.798 2.2653 2.4227 2.2653z"
      fill="url(#${id}-k)"
    />
    <path
      d="m65.044 25.8947c-2.516 0-4.1033-1.1973-4.1033-4.01v-17.80462h2.6366v17.49862c0 1.3834.9194 1.866 2.0514 1.866.2786 0 .464 0 .7613-.028v2.358c-.2133.0647-.6773.1207-1.346.1207z"
      fill="url(#${id}-l)"
    />
    <path
      d="m90.5908 26.109c-2.302 0-4.168-.52-5.3287-1.1326v-2.7847c1.318.7613 3.5273 1.504 5.4493 1.504s3.0634-.826 3.0634-2.024-.8914-1.838-3.7967-2.5433c-3.3973-.826-4.836-2.1447-4.836-4.66 0-2.664 2.0513-4.2887 5.542-4.2887 1.996 0 3.7967.492 4.9293 1.1047v2.7293c-1.838-.9193-3.342-1.4113-4.9666-1.4113-1.9307 0-2.9707.6773-2.9707 1.866 0 1.0673.7333 1.7453 3.5553 2.4226 3.398.826 5.1154 2.0794 5.1154 4.7527s-1.6527 4.4747-5.7647 4.4747l.0093-.0094z"
      fill="url(#${id}-m)"
    />
    <path
      d="m82.7488 23.4447c-.7427 0-1.0767-.3067-1.0767-1.29v-11.6693h-2.6367v2.692c-.9193-1.996-2.6366-2.9987-4.8733-2.9987-4.2887 0-6.4333 3.648-6.4333 7.9647 0 4.3166 2.0886 7.9646 6.2286 7.9646 2.6087 0 4.1307-1.1326 5.124-3.1193.232 1.894 1.42 2.896 3.11 2.896.5387 0 .91-.0467 1.1694-.1207v-2.358c-.3067.028-.334.028-.6127.028v.0094zm-3.7134-4.688c0 3.3973-2.1166 4.9013-4.4746 4.9013-2.7294 0-4.196-1.838-4.196-5.514s1.532-5.514 4.502-5.514c2.2373 0 4.168 1.504 4.168 4.9014v1.2253z"
      fill="url(#${id}-n)"
    />`;

    /**
     * inverse icons use transparency to achieve a certain gradient effect, requiring a different SVG structure
     */
    const inverseIconContents = `
    <linearGradient id="${id}-inverse-a">
      <stop offset="0" stop-color="#fff" stop-opacity=".6" />
      <stop offset="1" stop-color="#fff" />
    </linearGradient>
    <linearGradient id="${id}-inverse-b" gradientUnits="userSpaceOnUse" x1="95.6972" x2="29.2126" xlink:href="#${id}-inverse-a"
      y1="-1.88441" y2="20.5989" />
    <linearGradient id="${id}-inverse-c" gradientUnits="userSpaceOnUse" x1="97.0604" x2="30.5757" xlink:href="#${id}-inverse-a"
      y1="2.13449" y2="24.6178" />
    <linearGradient id="${id}-inverse-d" gradientUnits="userSpaceOnUse" x1="97.5154" x2="31.0315" xlink:href="#${id}-inverse-a"
      y1="3.49308" y2="25.9764" />
    <linearGradient id="${id}-inverse-e" gradientUnits="userSpaceOnUse" x1="101.279" x2="34.794" xlink:href="#${id}-inverse-a"
      y1="14.5962" y2="37.0882" />
    <linearGradient id="${id}-inverse-f" gradientUnits="userSpaceOnUse" x1="99.9384" x2="33.4544" xlink:href="#${id}-inverse-a"
      y1="10.6359" y2="33.1192" />
    <linearGradient id="${id}-inverse-g" gradientUnits="userSpaceOnUse" x1="9.22533" x2="4.69333" y1="25.3248"
      y2="5.13609">
      <stop offset="0" stop-color="#fff" />
      <stop offset=".17" stop-color="#fff" stop-opacity=".91" />
      <stop offset=".5" stop-color="#fff" stop-opacity=".74" />
      <stop offset=".76" stop-color="#fff" stop-opacity=".64" />
      <stop offset=".92" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="${id}-inverse-h">
      <stop offset="0" stop-color="#fff" />
      <stop offset=".18" stop-color="#fff" stop-opacity=".91" />
      <stop offset=".55" stop-color="#fff" stop-opacity=".74" />
      <stop offset=".83" stop-color="#fff" stop-opacity=".64" />
      <stop offset="1" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="${id}-inverse-i" gradientUnits="userSpaceOnUse" x1="6.76069" x2="16.4834" xlink:href="#${id}-inverse-h"
      y1="15.0061" y2="18.9068" />
    <linearGradient id="${id}-inverse-j" gradientUnits="userSpaceOnUse" x1="18.7907" x2="16.8967" xlink:href="#${id}-inverse-h"
      y1="3.59276" y2="23.2521" />
    <linearGradient id="${id}-inverse-k" gradientUnits="userSpaceOnUse" x1="14.886" x2="14.886" y1="28.5366"
      y2="5.46924">
      <stop offset=".1" stop-color="#fff" />
      <stop offset=".27" stop-color="#fff" stop-opacity=".91" />
      <stop offset=".59" stop-color="#fff" stop-opacity=".74" />
      <stop offset=".85" stop-color="#fff" stop-opacity=".64" />
      <stop offset="1" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="${id}-inverse-l" gradientUnits="userSpaceOnUse" x1="8.63728" x2="10.0113" y1="5.09736"
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
      d="m34.6712 21.2863-1.68 4.5299h-3.0913l7.9273-20.12528h3.4907l7.9367 20.12528h-3.0914l-1.6893-4.5673c-1.81.3714-3.37.548-4.994.548-1.532 0-3.0913-.1853-4.8087-.52zm8.9767-2.33-4.0753-11.02805-4.0754 11.05605c1.504.2413 2.7574.3713 3.9827.3713 1.29 0 2.6087-.158 4.168-.3993z"
      fill="url(#${id}-inverse-b)" />
    <path
      d="m56.3731 23.3378c.6126 0 1.1973-.1206 1.6526-.2133v2.5433c-.464.1207-.984.2414-1.7733.2414-3.2767 0-4.8733-1.9307-4.8733-4.7807v-8.178h-2.4787v-2.4507h2.4787v-3.24931h2.5713v3.24931h4.0753v2.4507h-4.0753v8.1227c0 1.346.798 2.2653 2.4227 2.2653z"
      fill="url(#${id}-inverse-c)" />
    <path
      d="m65.0428 25.9084c-2.516 0-4.1033-1.1973-4.1033-4.01v-17.80465h2.6366v17.49865c0 1.3833.9193 1.866 2.0513 1.866.2787 0 .464 0 .7614-.028v2.358c-.2134.0647-.6774.1207-1.346.1207z"
      fill="url(#${id}-inverse-d)" />
    <path
      d="m90.5893 26.1222c-2.302 0-4.168-.52-5.3287-1.1327v-2.7846c1.318.7613 3.5274 1.504 5.4494 1.504s3.0633-.826 3.0633-2.024-.8913-1.838-3.7967-2.5434c-3.3973-.826-4.836-2.1446-4.836-4.66 0-2.664 2.0514-4.2886 5.542-4.2886 1.996 0 3.7967.492 4.9294 1.1046v2.7294c-1.838-.9194-3.342-1.4114-4.9667-1.4114-1.9307 0-2.9707.6774-2.9707 1.866 0 1.0674.7334 1.7454 3.5554 2.4227 3.398.826 5.1153 2.0793 5.1153 4.7527 0 2.6733-1.6527 4.4746-5.7647 4.4746l.0094-.0093z"
      fill="url(#${id}-inverse-e)" />
    <path
      d="m82.747 23.4579c-.7426 0-1.0766-.3067-1.0766-1.29v-11.6693h-2.6367v2.692c-.9193-1.996-2.6367-2.9987-4.8733-2.9987-4.2887 0-6.4333 3.648-6.4333 7.9647 0 4.3166 2.0886 7.9646 6.2286 7.9646 2.6087 0 4.1307-1.1326 5.124-3.1193.232 1.894 1.42 2.896 3.11 2.896.5387 0 .91-.0467 1.1693-.1207v-2.358c-.3066.028-.334.028-.6126.028v.0094zm-3.7133-4.688c0 3.3973-2.1166 4.9013-4.4746 4.9013-2.7294 0-4.1961-1.838-4.1961-5.514s1.5321-5.514 4.5021-5.514c2.2373 0 4.1679 1.504 4.1679 4.9014v1.2253z"
      fill="url(#${id}-inverse-f)" />
    <path
      d="m12.0727 6.31409v-1.922c-6.6587 0-12.0727 5.414-12.0727 12.07201 0 .6873.0653333 1.356.167333 2.0153 0 .028 0 .0654.009334.0927 1.002663 5.6553 5.943333 9.9647 11.886633 9.9647v-1.922c-5.0333 0-9.2213-3.6774-10.01063-8.488-.06534-.4827.074-.9754.39-1.3654.50133-.6126 1.402-.938 2.6-.938.63133 0 1.226.0834 1.848.2507v-1.9687c-.60334-.13-1.20734-.1953-1.848-.1953-1.30934 0-2.266.2973-2.95334.6967.882-4.71738 5.024-8.29271 9.98267-8.29271z"
      fill="url(#${id}-inverse-g)" />
    <path
      d="m14.032 16.9475c-.464-.204-.9846-.446-1.5786-.706-.3434-.1487-.678-.2974-.9934-.4367-1.80131-.7987-3.18531-1.4113-4.56864-1.6993v1.9686c1.04933.2787 2.19133.78 3.78864 1.486.316.1394.65.288 1.0027.4367.5853.26 1.1053.492 1.56.6967 1.6807.752 2.6933 1.2073 3.9747 1.4673l.3713-1.8853c-1.068-.2134-1.95-.6034-3.5567-1.328z"
      fill="url(#${id}-inverse-i)" />
    <path
      d="m24.1354 16.2508v-.4734c-.3713-6.34264-5.6367-11.38531-12.0633-11.38531v1.922c5.5253 0 10.0293 4.42931 10.1406 9.92731-.0093.3807-.1206.882-.52 1.3187-.52.5667-1.4206.8633-2.6093.8633-.5107 0-1.0027-.0466-1.5047-.1486l-.3713 1.8853c.622.1207 1.2353.186 1.876.186 1.0587 0 1.8947-.186 2.5353-.464-1.402 3.9187-5.1633 6.7327-9.556 6.7327v1.922c6.6587 0 12.0727-5.414 12.0727-12.0727 0-.074 0-.1393 0-.2133z"
      fill="url(#${id}-inverse-j)" />
    <path
      d="m12.0727 28.5366v-1.922c2.758 0 4.402-2.814 4.402-7.522s-1.6713-8.6554-5.098-12.3047l1.402-1.31866c3.7793 4.02133 5.618 8.47866 5.618 13.62336 0 5.8226-2.424 9.4446-6.324 9.4446z"
      fill="url(#${id}-inverse-k)" />
    <path
      d="m12.0726 28.5367c-4.15132 0-6.52865-3.38-6.52865-9.2773 0-6.8814 3.00866-10.72604 5.82265-13.78137l1.4113 1.3c-3.27795 3.56597-5.31195 6.89067-5.31195 12.48137 0 6.0826 2.50733 7.3546 4.60595 7.3546v1.922z"
      fill="url(#${id}-inverse-l)" />
    <g fill="#fff">
      <path
        d="m6.928 17.4673c1.24117 0 2.24733-1.0061 2.24733-2.2473s-1.00616-2.2473-2.24733-2.2473-2.24734 1.0061-2.24734 2.2473 1.00617 2.2473 2.24734 2.2473z" />
      <path
        d="m17.3194 21.3399c1.2411 0 2.2473-1.0062 2.2473-2.2474 0-1.2411-1.0062-2.2473-2.2473-2.2473-1.2412 0-2.2474 1.0062-2.2474 2.2473 0 1.2412 1.0062 2.2474 2.2474 2.2474z" />
      <path
        d="m12.0728 7.95805c1.2411 0 2.2473-1.00617 2.2473-2.24734s-1.0062-2.24733-2.2473-2.24733c-1.2412 0-2.24736 1.00616-2.24736 2.24733s1.00616 2.24734 2.24736 2.24734z" />
    </g>
  `;

    return `<svg
      fill="none"
      height="32"
      viewBox="0 0 97 32"
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
 * The Atlas logo with both the wordmark and the icon combined.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 *
 * @deprecated AtlasLogo is deprecated and will be removed from atlaskit/logo in the next major release.
 */
export const AtlasLogo = ({
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
      size={size}
      svg={svg({ appearance }, colorMode)}
      testId={testId}
    />
  );
};
