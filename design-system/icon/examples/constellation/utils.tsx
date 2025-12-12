import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';

const TextBoxStyles = xcss({
	width: '100px',
	height: '24px',
	backgroundColor: 'color.background.accent.teal.subtler',
});
const IconContainerStyles = xcss({
	backgroundColor: 'color.background.accent.teal.subtle',
	padding: 'space.050',
});
const IconWrapperStyles = xcss({
	backgroundColor: 'color.background.accent.teal.subtler',
	// To demonstrate dimensions of child icon
	lineHeight: 0,
});

const RowHeaderStyles = xcss({ width: '180px' });

export const RowHeader = ({ children }: { children: React.ReactChild }): React.JSX.Element => (
	<Box xcss={RowHeaderStyles}>
		<Text weight="bold">{children}</Text>
	</Box>
);

export const IconContainer = ({ children }: { children: React.ReactChild }): React.JSX.Element => (
	<Inline space="space.100" alignBlock="center" xcss={IconContainerStyles}>
		<Box xcss={TextBoxStyles} />
		<Box xcss={IconWrapperStyles}>{children}</Box>
	</Inline>
);
