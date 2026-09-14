/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const mutedIndicatorStyles = css({
	width: '29px',
	height: '2px',
	position: 'absolute',
	top: token('space.100'),
	left: token('space.100'),
	zIndex: 2,
	background: '#FF5630',
	transform: 'rotate(32deg) translateY(10px)',
	opacity: 0,
	pointerEvents: 'none',
});

const isMutedStyles = css({
	opacity: 1,
});

export const MutedIndicator = ({
	isMuted,
	children,
	...props
}: MutedIndicatorProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={[mutedIndicatorStyles, isMuted && isMutedStyles]} {...props}>
		{children}
	</div>
);
export interface MutedIndicatorProps {
	isMuted: boolean;
}
