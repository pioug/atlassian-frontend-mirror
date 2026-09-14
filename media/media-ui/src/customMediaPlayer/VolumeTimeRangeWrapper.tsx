/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const volumeTimeRangeWrapperStyles = css({
	width: '100%',
	marginRight: token('space.250'),
});

export const VolumeTimeRangeWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={volumeTimeRangeWrapperStyles} {...props}>
		{children}
	</div>
);
