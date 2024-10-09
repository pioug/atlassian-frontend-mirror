import { Stack } from '@atlaskit/primitives';
import React from 'react';
import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="InlineCard Views">
		<Stack>
			<CardViewExample appearance="inline" />
		</Stack>
	</ExampleContainer>
);
