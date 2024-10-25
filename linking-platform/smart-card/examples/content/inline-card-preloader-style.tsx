import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Inline, Stack, Text } from '@atlaskit/primitives';

import { ResolvingClient, ResolvingClientUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvingClient('stg')}>
		<Stack space="space.100">
			<Inline alignBlock="center" space="space.100">
				<Text>Default (left with skeleton):</Text>
				<Card
					appearance="inline"
					inlinePreloaderStyle="on-left-with-skeleton"
					url={ResolvingClientUrl}
				/>
			</Inline>
			<Inline alignBlock="center" space="space.100">
				<Text>On right without skeleton:</Text>
				<Card
					appearance="inline"
					inlinePreloaderStyle="on-right-without-skeleton"
					url={ResolvingClientUrl}
				/>
			</Inline>
		</Stack>
	</SmartCardProvider>
);
