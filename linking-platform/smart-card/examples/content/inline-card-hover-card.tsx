import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrl,
} from '../../examples/utils/custom-client';
import { Card } from '../../src';
import { Stack, Text } from '@atlaskit/primitives';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack space="space.100">
			<Text>Hover over Smart Links</Text>
			<Card appearance="inline" showHoverPreview={true} url={ResolvedClientUrl} />
			<Card appearance="inline" showHoverPreview={true} url={ResolvedClientEmbedUrl} />
		</Stack>
	</SmartCardProvider>
);
