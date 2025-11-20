import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrl,
} from '@atlaskit/link-test-helpers';
import { Stack, Text } from '@atlaskit/primitives/compiled';

import { Card } from '../../src';

export default (): React.JSX.Element => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack space="space.100">
			<Text>Hover over Smart Links</Text>
			<Card appearance="inline" showHoverPreview={true} url={ResolvedClientUrl} />
			<Card appearance="inline" showHoverPreview={true} url={ResolvedClientEmbedUrl} />
		</Stack>
	</SmartCardProvider>
);
