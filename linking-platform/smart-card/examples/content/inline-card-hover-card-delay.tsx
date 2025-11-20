import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { Card } from '../../src';

export default (): React.JSX.Element => (
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
