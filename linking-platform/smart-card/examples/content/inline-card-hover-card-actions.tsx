import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { Card, CardAction } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack space="space.100">
			<Inline alignBlock="center" space="space.100">
				<Text>Show all available actions (default):</Text>
				<Card appearance="inline" showHoverPreview={true} url={ResolvedClientUrl} />
			</Inline>
			<Inline alignBlock="center" space="space.100">
				<Text>Hide all actions:</Text>
				<Card
					appearance="inline"
					actionOptions={{ hide: true }}
					showHoverPreview={true}
					url={ResolvedClientUrl}
				/>
			</Inline>
			<Inline alignBlock="center" space="space.100">
				<Text>Show all actions except preview action:</Text>
				<Card
					appearance="inline"
					actionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}
					showHoverPreview={true}
					url={ResolvedClientUrl}
				/>
			</Inline>
		</Stack>
	</SmartCardProvider>
);
