import { Stack } from '@atlaskit/primitives';
import React from 'react';
import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="EmbedCard Views">
		<Stack>
			<CardViewExample
				appearance="embed"
				frameStyle="show"
				url="https://youtu.be/hENQFInHMs0?si=9_IZk_uGOBsh4D0a"
			/>
		</Stack>
	</ExampleContainer>
);
