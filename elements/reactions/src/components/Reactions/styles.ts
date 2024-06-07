/** @jsx jsx */
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const reactionPickerStyle = css({
	display: 'inline-block',
	marginTop: token('space.050', '4px'),
});

export const seeWhoReactedStyle = css({
	height: '24px',
	lineHeight: '24px',
	paddingLeft: 0,
	paddingRight: 0,
	marginTop: token('space.050', '4px'),
	marginLeft: token('space.050', '4px'),
});

export const wrapperStyle = css({
	display: 'flex',
	flexWrap: 'wrap',
	position: 'relative',
	alignItems: 'center',
	borderRadius: '15px',
	marginTop: token('space.negative.050', '-4px'),
	'> :first-of-type > :first-of-type': { marginLeft: 0 },
});
