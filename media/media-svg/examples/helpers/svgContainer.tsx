/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@compiled/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
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
