import React, { type ReactNode } from 'react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack, xcss, Box } from '@atlaskit/primitives';

const centeredFormStyles = xcss({
	height: '100%',
	width: '300px',
	margin: 'auto',
});

export const CenteredForm = ({ children }: { children: ReactNode }) => (
	<Stack alignInline="center" alignBlock="center" grow="fill" xcss={centeredFormStyles}>
		<Box>{children}</Box>
	</Stack>
);
