import React from 'react';

import { Stack } from '@atlaskit/primitives';

import { BlockCardLazyIcons } from './utils/block-card-lazy-icons';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="Block Lazy Icons">
		<Stack>
			<BlockCardLazyIcons />
		</Stack>
	</ExampleContainer>
);
