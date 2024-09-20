import { Stack } from '@atlaskit/primitives';
import React from 'react';

import { BlockCardResolvingView } from '../src/view/BlockCard';
import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="BlockCard Views">
		<Stack>
			<CardViewExample appearance="block" />
			<h2>With useLegacyBlockCard</h2>
			<h6>[Resolving]</h6>
			<BlockCardResolvingView />
			<CardViewExample appearance="block" useLegacyBlockCard={true} />
		</Stack>
	</ExampleContainer>
);
