import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const mockTopBarStyles = xcss({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr auto',
	padding: 'space.100',
	backgroundColor: 'elevation.surface',
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderRadius: 'radius.small',
	gap: 'space.200',
});

export function MockTopBar({ children }: { children: ReactNode }): React.JSX.Element {
	return <Box xcss={mockTopBarStyles}>{children}</Box>;
}
