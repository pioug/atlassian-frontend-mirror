/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';

import { Box } from '../src/compiled';

const boxStyles = cssMap({
	root: {
		width: '3rem',
		height: '3rem',
	},
});

export default function Basic() {
	return (
		<Box
			backgroundColor="color.background.brand.bold"
			testId="box-basic"
			padding="space.100"
			xcss={boxStyles.root}
		/>
	);
}
