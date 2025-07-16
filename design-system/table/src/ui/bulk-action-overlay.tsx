import React, { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';

const overlayStyles = xcss({
	display: 'flex',
	position: 'absolute',
	inset: 'space.0',
	insetInlineStart: 'space.400',
});

/**
 * __Bulk action overlay__
 *
 * A bulk action overlay is used to conditionally render when a user makes a row selection
 */
export const BulkActionOverlay: FC<{ children: ReactNode }> = ({ children }) => (
	<Box as="th" paddingInline="space.100" backgroundColor="elevation.surface" xcss={overlayStyles}>
		<Inline space="space.300" alignBlock="center">
			{children}
		</Inline>
	</Box>
);
