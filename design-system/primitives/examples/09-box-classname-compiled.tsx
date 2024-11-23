/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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
