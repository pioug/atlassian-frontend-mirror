import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const cardStyles = xcss({
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderRadius: 'border.radius.200',
	borderStyle: 'solid',
});

const Card = ({ children }: { children: ReactNode }) => {
	return (
		<Box xcss={cardStyles} padding="space.300">
			{children}
		</Box>
	);
};

export default Card;
