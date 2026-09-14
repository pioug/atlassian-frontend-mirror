import React from 'react';

import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';

const Block = () => <Box backgroundColor="color.background.neutral" padding="space.600" />;

export default function Basic(): React.JSX.Element {
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
