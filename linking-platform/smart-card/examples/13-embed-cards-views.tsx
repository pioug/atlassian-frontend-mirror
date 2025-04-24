import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import { Card } from '@atlaskit/smart-card';

import CardViewExample from './card-view';
import CardViewSection from './card-view/card-view-section';
import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrlNoPreview,
} from './utils/custom-client';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="EmbedCard Views">
		<Stack>
			<CardViewExample
				appearance="embed"
				frameStyle="show"
				url={ResolvedClientEmbedUrl}
				CardComponent={Card}
			/>
			<CardViewSection
				appearance="embed"
				frameStyle="show"
				url={ResolvedClientUrlNoPreview}
				client={new ResolvedClient()}
				title="[Resolved] No preview fallback"
				CardComponent={Card}
			/>
		</Stack>
	</ExampleContainer>
);
