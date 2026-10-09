import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const cardStyles = xcss({
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderRadius: 'radius.large',
	borderStyle: 'solid',
});

const Card = ({ children }: { children: ReactNode }): React.JSX.Element => {
	return (
		<Box xcss={cardStyles} padding="space.300">
			{children}
		</Box>
	);
};

export default Card;
