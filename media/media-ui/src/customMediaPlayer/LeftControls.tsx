/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const leftControlsStyles = css({
	display: 'flex',
	marginLeft: token('space.150'),
});

export const LeftControls = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={leftControlsStyles} {...props}>
		{children}
	</div>
);
