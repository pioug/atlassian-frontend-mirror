import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { ResolvedClient, ResolvedClientUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack space="space.100">
			<Inline alignBlock="center" space="space.100">
				<Text>Immediate:</Text>
				<Card
					appearance="inline"
					showHoverPreview={true}
					hoverPreviewOptions={{ fadeInDelay: 0 }}
					url={ResolvedClientUrl}
				/>
			</Inline>
			<Inline alignBlock="center" space="space.100">
				<Text>Delay 1,000 milliseconds:</Text>
				<Card
					appearance="inline"
					showHoverPreview={true}
					hoverPreviewOptions={{ fadeInDelay: 1000 }}
					url={ResolvedClientUrl}
				/>
			</Inline>
		</Stack>
	</SmartCardProvider>
);
