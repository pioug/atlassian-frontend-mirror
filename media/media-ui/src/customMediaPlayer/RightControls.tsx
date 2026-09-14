/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const rightControlStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.150'),
});

export const RightControls = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={rightControlStyles} {...props}>
		{children}
	</div>
);
