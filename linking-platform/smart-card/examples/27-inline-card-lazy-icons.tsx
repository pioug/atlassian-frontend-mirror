import React from 'react';

import { Stack } from '@atlaskit/primitives';

import ExampleContainer from './utils/example-container';
import { InlineCardIcons } from './utils/inline-card-icons';

export default () => (
	<ExampleContainer title="InlineCard Lazy Icons">
		<Stack>
			<InlineCardIcons />
		</Stack>
	</ExampleContainer>
);
