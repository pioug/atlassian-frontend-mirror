import React from 'react';

import { cssMap } from '@compiled/react';

import { Box, Pressable } from '@atlaskit/primitives/compiled';
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

export default function PressableCompiledGlobalStylesExample() {
	return (
		<Box xcss={styles.root}>
			<GlobalStyleSimulator />
			<Pressable>Press me</Pressable>
		</Box>
	);
}
