import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Stack, Text } from '@atlaskit/primitives/compiled';

import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrl,
} from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack space="space.100">
			<Text>Hover over Smart Links</Text>
			<Card appearance="inline" showHoverPreview={true} url={ResolvedClientUrl} />
			<Card appearance="inline" showHoverPreview={true} url={ResolvedClientEmbedUrl} />
		</Stack>
	</SmartCardProvider>
);
