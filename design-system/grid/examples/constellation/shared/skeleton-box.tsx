import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const skeletonStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: 'color.border.discovery',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	height: 'size.400',
});

export const SkeletonBox = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<Box backgroundColor="color.background.discovery" xcss={skeletonStyles}>
		{children}
	</Box>
);
