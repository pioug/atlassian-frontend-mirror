import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import { ResolvedClient, ResolvedClientUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Card appearance="inline" isHovered={true} url={ResolvedClientUrl} />
	</SmartCardProvider>
);
