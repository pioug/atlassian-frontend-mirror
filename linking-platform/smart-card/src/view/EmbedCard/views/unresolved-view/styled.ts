import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { gs } from '../../../common/utils';

export const containerStyles = css({
	display: 'grid',
	height: 'inherit',
});

export const contentStyles = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	margin: 'auto',
	padding: token('space.200', '16px'),
	gap: token('space.250', '20px'),
	maxWidth: gs(50),
});

export const imageStyles = css({
	height: '120px',
	width: '180px',
	objectFit: 'contain',
	objectPosition: 'center center',
});

export const titleStyles = css({
	textAlign: 'center',
	margin: 0,
	padding: 0,
});

export const descriptionStyles = css({
	fontSize: '1em',
	textAlign: 'center',
});
