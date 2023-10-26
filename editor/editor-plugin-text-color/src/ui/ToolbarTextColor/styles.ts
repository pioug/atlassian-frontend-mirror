import { css } from '@emotion/react';

import { N40, N60, N80, P300, R400, T300, Y400 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const createSteppedRainbow = (colors: string[]) => {
  return `
    linear-gradient(
      to right,
      ${colors
        .map((color, i) => {
          const inc = 100 / colors.length;
          const pos = i + 1;

          if (i === 0) {
            return `${color} ${pos * inc}%,`;
          }

          if (i === colors.length - 1) {
            return `${color} ${(pos - 1) * inc}%`;
          }

          return `
            ${color} ${(pos - 1) * inc}%,
            ${color} ${pos * inc}%,
          `;
        })
        .join('\n')}
    );
    `;
};

// TODO: https://product-fabric.atlassian.net/browse/DSP-4137
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const rainbow = createSteppedRainbow([P300, T300, Y400, R400]);

const disabledRainbow = createSteppedRainbow([N80, N60, N40, N60]);
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const textColorIconWrapper = css`
  position: relative;
`;

export const textColorIconBar = css`
  position: absolute;
  left: 0;
  right: 0;
  top: ${token('space.200', '16px')};
  margin: auto;
  width: 12px;
  height: 3px;
  border-radius: ${borderRadius() + 'px'};
  background: ${rainbow};
`;

export const backgroundDisabled = css`
  background: ${disabledRainbow};
`;
