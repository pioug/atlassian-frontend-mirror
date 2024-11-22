import React from 'react';

import { Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variants from '../src/utils/variants';

export default function ShouldFitContainerExample() {
	return (
		<Stack space="space.100">
			{variants.map(({ name, Component }) => (
				<Component key={name} shouldFitContainer>
					{name}
				</Component>
			))}
		</Stack>
	);
}
