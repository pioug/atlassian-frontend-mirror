/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

const bufferedTimeStyles = css({
	backgroundColor: '#8696a7',
	height: 'inherit',
	borderRadius: 'inherit',
	width: 0,
});

export const BufferedTime = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={bufferedTimeStyles} {...props}>
		{children}
	</div>
);
