import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const HEIGHT = 120;

export const noResultsSVGStyles = css({
	height: `${HEIGHT}px`,
	margin: `0 auto ${token('space.300', '24px')}`,
	display: 'block',
});
