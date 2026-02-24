/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { token } from '@atlaskit/tokens';
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	root: {
		marginBlockStart: token('space.100'),
		marginBlockEnd: token('space.100'),
	},
});

export function List({
	children,
	type,
}: {
	children: React.ReactNode;
	type: 'bullet' | 'ordered';
}) {
	return (
		<Box as={type === 'ordered' ? 'ol' : 'ul'} xcss={styles.root}>
			{children}
		</Box>
	);
}
