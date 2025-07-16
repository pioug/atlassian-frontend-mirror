import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variants from '../src/utils/variants';

export default function ShouldFitContainerExample() {
	return (
		<Stack space="space.100">
			{variants.map(({ name, Component }) => (
				<Box key={name}>
					<Component key={name} shouldFitContainer>
						{name}
					</Component>
				</Box>
			))}
		</Stack>
	);
}
