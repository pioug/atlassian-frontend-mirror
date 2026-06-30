/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		paddingBlockStart: token('space.600'),
		paddingInlineEnd: token('space.600'),
		paddingBlockEnd: token('space.600'),
		paddingInlineStart: token('space.600'),
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
