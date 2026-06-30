/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		width: '3rem',
		height: '3rem',
		transition: 'all 0.3s',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		'&:hover': {
			transform: 'scale(2)',
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
		},
	},
});

export default function Basic(): JSX.Element {
	return (
		<Box
			xcss={styles.root}
			backgroundColor="color.background.brand.bold"
			testId="box-basic"
			padding="space.100"
		/>
	);
}
