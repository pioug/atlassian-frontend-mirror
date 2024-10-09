import { Stack } from '@atlaskit/primitives';
import React from 'react';
import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="BlockCard Views">
		<Stack>
			<CardViewExample appearance="block" />
			<h2>With useLegacyBlockCard</h2>
			<CardViewExample appearance="block" useLegacyBlockCard={true} />
		</Stack>
	</ExampleContainer>
);
