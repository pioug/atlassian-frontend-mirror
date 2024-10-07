import { SmartCardProvider } from '@atlaskit/link-provider';
import { Inline, Text } from '@atlaskit/primitives';
import React from 'react';
import { Card } from '../../src';
import { ResolvedClient } from '../utils/custom-client';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Inline alignBlock="center" space="space.100">
			<Text>Default (url): </Text>
			<Card appearance="inline" url="https://example-url" />
		</Inline>
		<Inline alignBlock="center" space="space.100">
			<Text>With placeholder: </Text>
			<Card appearance="inline" placeholder="spaghetti" url="https://example-url" />
		</Inline>
	</SmartCardProvider>
);
