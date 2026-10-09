import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

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
export function MockRoot({ children }: { children: ReactNode }): React.JSX.Element {
	return <Box xcss={mockRootStyles}>{children}</Box>;
}
