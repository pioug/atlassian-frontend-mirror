import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const mockSideNavStyles = xcss({
	width: '300px',
	backgroundColor: 'elevation.surface',
	borderRadius: 'border.radius.300',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border',
});

export function MockSideNav({ children }: { children: ReactNode }) {
	return <Box xcss={mockSideNavStyles}>{children}</Box>;
}
