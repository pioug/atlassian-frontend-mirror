import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { checkeredBg } from '../src/image-placer/styles';

export const labelStyles = css({
	display: 'block',
	'> input': {
		marginLeft: token('space.100', '8px'),
	},
	'> span': {
		display: 'inline-block',
		minWidth: '120px',
		textAlign: 'right',
	},
});
export const exportedImageStyles = css({
	border: `1px solid ${token('color.border', '#ccc')}`,
});

export const exportedImageWrapperStyles = css({
	display: 'inline-block',
	background: `url('${checkeredBg}')`,
	marginTop: token('space.250', '20px'),
	position: 'relative',
});

export const layoutStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-around',
	height: '80vh',
});

export const wrapperStyles = css({
	margin: token('space.100', '8px'),
});
