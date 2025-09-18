import React from 'react';

import { cssMap } from '@compiled/react';

import { Anchor, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { GlobalStyleSimulator } from './utils/global-style-simulator';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default function AnchorCompiledGlobalStylesExample() {
	return (
		<Box xcss={styles.root}>
			<GlobalStyleSimulator />
			<Anchor href="#">I am an anchor</Anchor>
		</Box>
	);
}
