import { css } from '@emotion/react';

const blockGap = '0.5rem';
const iconGap = '0.5rem';
const titleFontWeight = '500';

export const connectButtonStyles = css({
	justifyContent: 'flex-end',
	marginTop: blockGap,
});

export const titleBlockStyles = css({
	gap: `${blockGap} ${iconGap}`,
	a: {
		fontWeight: titleFontWeight,
	},
});

export const mainTextStyles = css({
	marginTop: blockGap,
	fontSize: '0.75rem',
});
