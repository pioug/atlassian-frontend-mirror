import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrl,
} from '@atlaskit/link-test-helpers';
import { Box, Stack, Text, xcss } from '@atlaskit/primitives';

import { Card } from '../../src';
import { CardSSR } from '../../src/ssr';

const gapStyles = xcss({ height: '3000px' });

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack grow="fill" space="space.600">
			<Box>
				<CardSSR appearance="inline" url={ResolvedClientUrl} />
			</Box>
			<Box xcss={gapStyles}>
				<Text>Scroll ⇣ to find a lazily loaded Smart Link 👇</Text>
			</Box>
			<Card appearance="block" url={ResolvedClientEmbedUrl} />
		</Stack>
	</SmartCardProvider>
);
