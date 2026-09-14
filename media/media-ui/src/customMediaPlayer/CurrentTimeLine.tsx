/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const currentTimeLineStyles = css({
	backgroundColor: '#05c',
	borderRadius: 'inherit',
	height: 'inherit',
	position: 'absolute',
	top: token('space.0'),
	maxWidth: '100%',
});

export const CurrentTimeLine = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={currentTimeLineStyles} {...props}>
		{children}
	</div>
);
