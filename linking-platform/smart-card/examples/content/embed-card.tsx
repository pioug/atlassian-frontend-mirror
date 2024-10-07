import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Card appearance="embed" frameStyle="show" platform="web" url={ResolvedClientEmbedUrl} />
	</SmartCardProvider>
);
