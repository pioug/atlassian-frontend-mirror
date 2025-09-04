import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';

const iconStyles = xcss({
	borderRadius: 'radius.small',
	flexShrink: 0,
	width: 'size.200',
	height: 'size.200',
});

const IconLink = ({ children }: { children: ReactNode }) => {
	return (
		<Inline space="space.100" alignBlock="center">
			<Box backgroundColor="color.background.neutral" xcss={iconStyles} />
			{children}
		</Inline>
	);
};

export default IconLink;
