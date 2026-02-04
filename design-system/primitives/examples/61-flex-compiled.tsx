/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		paddingTop: token('space.600'),
		paddingRight: token('space.600'),
		paddingBottom: token('space.600'),
		paddingLeft: token('space.600'),
	},
});

const Block = () => <Box backgroundColor="color.background.neutral" xcss={styles.block} />;

export default function Basic(): JSX.Element {
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
