/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const overflowShadow = ({
	leftCoverWidth,
	rightCoverWidth,
}: {
	leftCoverWidth?: string;
	rightCoverWidth?: string;
}) => {
	const width = token('space.100', '8px');
	const leftCoverWidthResolved = leftCoverWidth || width;
	const rightCoverWidthResolved = rightCoverWidth || width;

	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	return css`
/* shadow cover left */
  linear-gradient(
    to right,
    ${token('color.background.neutral')} ${leftCoverWidthResolved},
    transparent ${leftCoverWidthResolved}
  ),
/* shadow cover background left */
  linear-gradient(
    to right,
    ${token('elevation.surface.raised')} ${leftCoverWidthResolved},
    transparent ${leftCoverWidthResolved}
  ),
/* shadow cover right */
  linear-gradient(
    to left,
    ${token('color.background.neutral')} ${rightCoverWidthResolved},
    transparent ${rightCoverWidthResolved}
  ),
/* shadow cover background right */
  linear-gradient(
    to left,
    ${token('elevation.surface.raised')} ${rightCoverWidthResolved},
    transparent ${rightCoverWidthResolved}
  ),
/* overflow shadow right spread */
  linear-gradient(
    to left,
    ${token('elevation.shadow.overflow.spread')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  ),
  /* overflow shadow right perimeter */
  linear-gradient(
    to left,
    ${token('elevation.shadow.overflow.perimeter')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  ),
  /* overflow shadow left spread */
  linear-gradient(
    to right,
    ${token('elevation.shadow.overflow.spread')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  ),
  /* overflow shadow left perimeter */
  linear-gradient(
    to right,
    ${token('elevation.shadow.overflow.perimeter')} 0,
    ${token('utility.UNSAFE.transparent')}  ${width}
  )
`;
};
