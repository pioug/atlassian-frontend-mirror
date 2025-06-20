import React, { type ReactNode } from 'react';

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
