/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	height: '100%',
	backgroundColor: 'elevation.surface.overlay',
	padding: 'space.400',
	':hover': {
		backgroundColor: 'elevation.surface.overlay.hovered',
	},
});

// To simulate Jira description's hover background wrapper
export const HoverableContainer = ({ children }: React.PropsWithChildren<{}>) => {
	return (
		<Box testId="examples-hoverable-container" xcss={containerStyles}>
			{children}
		</Box>
	);
};
