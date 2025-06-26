import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';

import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Card actionOptions={{ hide: true }} appearance="block" url={ResolvedClientUrl} />
	</SmartCardProvider>
);
