import React from 'react';

import HeadingItem from '@atlaskit/menu/heading-item';
import { Box } from '@atlaskit/primitives/compiled/box';

export const QuickInsertMenuSection = ({
	children,
	title,
}: React.PropsWithChildren<{ title: string }>): React.JSX.Element => (
	<Box role="group" aria-label={title}>
		<Box paddingBlockStart="space.150" paddingBlockEnd="space.050">
			<HeadingItem aria-hidden>{title}</HeadingItem>
		</Box>
		{children}
	</Box>
);
