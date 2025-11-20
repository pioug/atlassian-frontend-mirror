import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvingClient, ResolvingClientUrl } from '@atlaskit/link-test-helpers';

import { Card } from '../../src';

export default (): React.JSX.Element => (
	<SmartCardProvider client={new ResolvingClient('stg')}>
		<Card
			appearance="inline"
			resolvingPlaceholder="This is a custom placeholder"
			url={ResolvingClientUrl}
		/>
	</SmartCardProvider>
);
