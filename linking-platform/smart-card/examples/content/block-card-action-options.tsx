import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import { ResolvedClient, ResolvedClientUrl } from '../utils/custom-client';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Card actionOptions={{ hide: true }} appearance="block" url={ResolvedClientUrl} />
	</SmartCardProvider>
);
