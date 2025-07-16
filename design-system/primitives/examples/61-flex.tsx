import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Flex } from '@atlaskit/primitives';

const Block = () => <Box backgroundColor="color.background.neutral" padding="space.600" />;

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
