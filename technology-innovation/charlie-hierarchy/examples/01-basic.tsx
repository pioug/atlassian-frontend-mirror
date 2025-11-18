import React from 'react';

import { hierarchy } from '@visx/hierarchy';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { CharlieHierarchy } from '../src';

import { rootNode } from './common/basic-hierarchy';

const containerStyles = xcss({
	display: 'flex',
	justifyContent: 'center',
});

const nodeStyles = xcss({
	width: '100%',
	height: '100%',
	backgroundColor: 'color.background.neutral.bold',
	color: 'color.text.inverse',
	textAlign: 'center',
});
export default function Basic(): React.JSX.Element {
	const root = hierarchy(rootNode);
	return (
		<Box xcss={containerStyles}>
			<CharlieHierarchy root={root} nodeSize={[100, 50]} size={[500, 700]}>
				{(node) => {
					return <Box xcss={nodeStyles}>{node.data.name}</Box>;
				}}
			</CharlieHierarchy>
		</Box>
	);
}
