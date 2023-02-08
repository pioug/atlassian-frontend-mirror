/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const overflowShadow = ({
  background,
  width = `${gridSize()}px`,
  leftCoverWidth,
  rightCoverWidth,
}: {
  background: string;
  width?: string;
  leftCoverWidth?: string;
  rightCoverWidth?: string;
}) => {
  const leftCoverWidthResolved = leftCoverWidth || width;
  const rightCoverWidthResolved = rightCoverWidth || width;

  return css`
/* shadow cover left */
  linear-gradient(
    to right,
    ${background} ${leftCoverWidthResolved},
    transparent ${leftCoverWidthResolved}
  ),
/* shadow cover background left */
  linear-gradient(
    to right,
    ${token(
      'elevation.surface.raised',
      'transparent',
    )} ${leftCoverWidthResolved},
    transparent ${leftCoverWidthResolved}
  ),
/* shadow cover right */
  linear-gradient(
    to left,
    ${background} ${rightCoverWidthResolved},
    transparent ${rightCoverWidthResolved}
  ),
/* shadow cover background right */
  linear-gradient(
    to left,
    ${token(
      'elevation.surface.raised',
      'transparent',
    )} ${rightCoverWidthResolved},
    transparent ${rightCoverWidthResolved}
  ),
/* overflow shadow right spread */
  linear-gradient(
    to left,
    ${token('elevation.shadow.overflow.spread', 'rgba(9, 30, 66, 0.13)')} 0,
    ${token('utility.UNSAFE.transparent', 'rgba(99, 114, 130, 0)')}  ${width}
  ),
  /* overflow shadow right perimeter */
  linear-gradient(
    to left,
    ${token('elevation.shadow.overflow.perimeter', 'transparent')} 0,
    ${token('utility.UNSAFE.transparent', 'transparent')}  ${width}
  ),
  /* overflow shadow left spread */
  linear-gradient(
    to right,
    ${token('elevation.shadow.overflow.spread', 'rgba(9, 30, 66, 0.13)')} 0,
    ${token('utility.UNSAFE.transparent', 'rgba(99, 114, 130, 0)')}  ${width}
  ),
  /* overflow shadow left perimeter */
  linear-gradient(
    to right,
    ${token('elevation.shadow.overflow.perimeter', 'transparent')} 0,
    ${token('utility.UNSAFE.transparent', 'transparent')}  ${width}
  )
`;
};
