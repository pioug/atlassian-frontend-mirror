import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

const controlsBoxStyles = xcss({
	maxWidth: '1500px',
	width: '90%',
	margin: 'auto',
	padding: 'space.100',
	[media.above.sm]: {
		width: '70%',
	},
	[media.above.lg]: {
		width: '50%',
	},
});

export const ControlsBox = ({ children }: { children: ReactNode }) => (
	<Box xcss={controlsBoxStyles}>{children}</Box>
);
