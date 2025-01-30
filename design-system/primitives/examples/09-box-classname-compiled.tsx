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
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		'&:hover': {
			transform: 'scale(2)',
			paddingTop: token('space.200'),
			paddingRight: token('space.200'),
			paddingBottom: token('space.200'),
			paddingLeft: token('space.200'),
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
