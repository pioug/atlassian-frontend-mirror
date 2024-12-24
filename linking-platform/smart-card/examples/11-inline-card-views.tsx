import React from 'react';

import { Stack } from '@atlaskit/primitives';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="InlineCard Views">
		<Stack>
			<CardViewExample appearance="inline" showHoverPreview={true} />
		</Stack>
	</ExampleContainer>
);
