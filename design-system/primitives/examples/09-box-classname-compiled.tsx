/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box } from '../src/compiled';

const styles = cssMap({
	root: {
		width: '3rem',
		height: '3rem',
		transition: 'all 0.3s',
		padding: token('space.100'),
		'&:hover': {
			transform: 'scale(2)',
			padding: token('space.200'),
		},
	},
});

export default function Basic() {
	return (
		<Box
			xcss={styles.root}
			backgroundColor="color.background.brand.bold"
			testId="box-basic"
			padding="space.100"
		/>
	);
}
