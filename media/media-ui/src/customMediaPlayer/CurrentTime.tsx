/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const currentTimeStyles = css({
	color: '#c7d1db',
	userSelect: 'none',
	marginRight: token('space.100'),
	whiteSpace: 'nowrap',
});

export const CurrentTime = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={currentTimeStyles} {...props}>
		{children}
	</div>
);
export interface CurrentTimeTooltipProps {
	isDragging: boolean;
	timeLineThumbIsHover: boolean;
	timeLineThumbIsFocus: boolean;
}
