/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	boxSizing: 'border-box',
	borderColor: 'color.border.accent.orange',
	borderStyle: 'solid',
	borderWidth: 'border.width.indicator',
	margin: 'auto',
	marginTop: 'space.100',
	backgroundColor: 'color.background.accent.green.subtler',
});

export const SvgContainer = ({
	children,
	width,
	height,
}: {
	children: React.ReactNode;
	width?: string;
	height?: string;
}) => {
	return (
		<Box xcss={containerStyles} style={{ width, height }}>
			{children}
		</Box>
	);
};
