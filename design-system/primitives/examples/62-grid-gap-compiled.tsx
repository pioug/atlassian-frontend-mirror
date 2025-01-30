/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Grid } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		borderColor: token('color.border'),
		borderStyle: 'dashed',
		borderWidth: token('border.width.outline'),
		borderRadius: token('border.radius'),
		paddingTop: token('space.600'),
		paddingRight: token('space.600'),
		paddingBottom: token('space.600'),
		paddingLeft: token('space.600'),
	},
});

const Block = () => <Box xcss={styles.block} backgroundColor="color.background.neutral" />;

export default function Basic() {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid testId="grid-basic" gap="space.100">
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid testId="grid-basic" gap="space.200">
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid testId="grid-basic" gap="space.400">
				<Block />
				<Block />
				<Block />
			</Grid>
		</Grid>
	);
}
