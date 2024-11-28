/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { css, jsx } from '@compiled/react';

const playPauseBlanketStyles = css({
	width: '100%',
	height: '100%',
	cursor: 'pointer',
});

export const PlayPauseBlanket = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={playPauseBlanketStyles} {...props}>
		{children}
	</div>
);
