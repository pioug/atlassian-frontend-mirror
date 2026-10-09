import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { media } from '@atlaskit/primitives/responsive/media';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

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

export const ControlsBox = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box xcss={controlsBoxStyles}>{children}</Box>
);
