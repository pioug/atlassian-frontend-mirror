import React from 'react';

import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrlNoPreview,
} from '@atlaskit/link-test-helpers';
import { Stack } from '@atlaskit/primitives/compiled';
import { Card } from '@atlaskit/smart-card';

import CardViewExample from './card-view';
import CardViewSection from './card-view/card-view-section';
import ExampleContainer from './utils/example-container';

export default (): React.JSX.Element => (
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
