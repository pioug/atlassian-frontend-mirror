import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const mockTopBarStyles = xcss({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr auto',
	padding: 'space.100',
	backgroundColor: 'elevation.surface',
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderRadius: 'border.radius',
	gap: 'space.200',
});

export function MockTopBar({ children }: { children: ReactNode }) {
	return <Box xcss={mockTopBarStyles}>{children}</Box>;
}
