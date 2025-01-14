import React from 'react';

import { Stack } from '@atlaskit/primitives';

import ExampleContainer from './utils/example-container';
import { InlineCardLazyIcons } from './utils/inline-card-lazy-icons';

export default () => (
	<ExampleContainer title="InlineCard Lazy Icons">
		<Stack>
			<InlineCardLazyIcons />
		</Stack>
	</ExampleContainer>
);
