import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const iconStyles = xcss({
	borderRadius: 'radius.small',
	flexShrink: 0,
	width: 'size.200',
	height: 'size.200',
});

const IconLink = ({ children }: { children: ReactNode }): React.JSX.Element => {
	return (
		<Inline space="space.100" alignBlock="center">
			<Box backgroundColor="color.background.neutral" xcss={iconStyles} />
			{children}
		</Inline>
	);
};

export default IconLink;
