import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient } from '@atlaskit/link-test-helpers';
import { Inline, Text } from '@atlaskit/primitives/compiled';

import { Card } from '../../src';

export default (): React.JSX.Element => (
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
