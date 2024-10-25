import React from 'react';

import { Stack } from '@atlaskit/primitives';

import CardViewExample from './card-view';
import { ResolvedClientEmbedUrl } from './utils/custom-client';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="EmbedCard Views">
		<Stack>
			<CardViewExample appearance="embed" frameStyle="show" url={ResolvedClientEmbedUrl} />
		</Stack>
	</ExampleContainer>
);
