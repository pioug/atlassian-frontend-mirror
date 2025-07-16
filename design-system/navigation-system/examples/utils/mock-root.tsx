import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const mockRootStyles = xcss({
	display: 'grid',
	gridTemplateAreas: '"top-bar"',
	height: '48px',
});

/**
 * A mock root allows us to show multiple top bars on the same example.
 *
 * It also avoids examples occupying the full screen height.
 */
export function MockRoot({ children }: { children: ReactNode }) {
	return <Box xcss={mockRootStyles}>{children}</Box>;
}
