import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const HEIGHT = 90;

export const genericErrorStyles = css({
	height: `${HEIGHT}px`,
	margin: `0 auto ${token('space.300', '24px')}`,
	display: 'block',
});
