import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import { Card } from '../../src';
import { ResolvedClient, ResolvedClientUrl } from '../utils/custom-client';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Card appearance="block" url={ResolvedClientUrl} />
	</SmartCardProvider>
);
