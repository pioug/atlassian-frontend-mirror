/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box, Flex } from '../src/compiled';

const styles = cssMap({
	block: {
		padding: token('space.600'),
	},
});

const Block = () => <Box backgroundColor="color.background.neutral" xcss={styles.block} />;

export default function Basic() {
	return (
		<Flex testId="flex-basic" wrap="wrap" gap="space.200">
			<Block />
			<Block />
			<Block />
			<Block />
			<Block />
			<Block />
		</Flex>
	);
}
