import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const triggerWrapper = css({
	display: 'flex',
});

export const wrapper = css({
	display: 'flex',
	alignItems: 'center',
	div: {
		display: 'flex',
	},
});

export const expandIconWrapper = css({
	marginLeft: token('space.negative.100', '-8px'),
});
