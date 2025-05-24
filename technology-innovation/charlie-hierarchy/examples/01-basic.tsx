import React from 'react';

import { hierarchy } from '@visx/hierarchy';

import { Box, xcss } from '@atlaskit/primitives';

import { CharlieHierarchy } from '../src';

import { rootNode } from './common/basic-hierachy';

const styles = xcss({
	width: '100%',
	height: '100%',
	backgroundColor: 'color.background.neutral.bold',
	color: 'color.text.inverse',
	textAlign: 'center',
});
export default function Basic() {
	const root = hierarchy(rootNode);
	return (
		<CharlieHierarchy root={root} nodeSize={[100, 50]} size={[500, 10]}>
			{(node) => {
				return <Box xcss={styles}>{node.data.name}</Box>;
			}}
		</CharlieHierarchy>
	);
}
