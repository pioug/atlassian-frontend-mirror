/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const thumbStyles = css({
	pointerEvents: 'none',
	width: '14px',
	height: '14px',
	borderRadius: token('radius.full'),
	backgroundColor: 'white',
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: '#666',
	position: 'absolute',
	right: 0,
	top: token('space.025'),
	transform: 'translate(7px, -50%) scale(0)',
	transition: 'all 0.1s',
	transitionDelay: '1s',
});

export const Thumb = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={thumbStyles} {...props}>
		{children}
	</div>
);
