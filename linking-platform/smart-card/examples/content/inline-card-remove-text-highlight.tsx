import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	ResolvedClient,
	ResolvedClientWithTextHighlightInTitleUrl,
} from '@atlaskit/link-test-helpers';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack space="space.100">
			<Inline alignBlock="center" space="space.100">
				<Text>Show all link title (default):</Text>
				<Card appearance="inline" url={ResolvedClientWithTextHighlightInTitleUrl} />{' '}
			</Inline>
			<Inline alignBlock="center" space="space.100">
				<Text>With text highlight removed:</Text>
				<Card
					appearance="inline"
					removeTextHighlightingFromTitle={true}
					url={ResolvedClientWithTextHighlightInTitleUrl}
				/>
			</Inline>
		</Stack>
	</SmartCardProvider>
);
