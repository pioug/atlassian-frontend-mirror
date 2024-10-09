import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import { ResolvingClient, ResolvingClientUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvingClient('stg')}>
		<Card
			appearance="inline"
			resolvingPlaceholder="This is a custom placeholder"
			url={ResolvingClientUrl}
		/>
	</SmartCardProvider>
);
