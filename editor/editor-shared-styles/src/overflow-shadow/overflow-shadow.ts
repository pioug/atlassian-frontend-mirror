/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const overflowShadow = ({
  background,
  width,
}: {
  background: string;
  width: string;
}) => css`
/* shadow cover left */
  linear-gradient(
    to right,
    ${background} ${width},
    transparent ${width}
  ),
/* shadow cover background left */
  linear-gradient(
    to right,
    ${token('elevation.surface.raised', 'transparent')} ${width},
    transparent ${width}
  ),
/* shadow cover right */
  linear-gradient(
    to left,
    ${background} ${width},
    transparent ${width}
  ),
/* shadow cover background right */
  linear-gradient(
    to left,
    ${token('elevation.surface.raised', 'transparent')} ${width},
    transparent ${width}
  ),
/* overflow shadow right */
  linear-gradient(
    to left,
    rgba(9, 30, 66, 0.13) 0,
    rgba(99, 114, 130, 0) ${width}
  ),
/* overflow shadow left */
  linear-gradient(
    to right,
    rgba(9, 30, 66, 0.13) 0,
    rgba(99, 114, 130, 0) ${width}
  )
`;
