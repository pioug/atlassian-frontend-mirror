import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import {
	ForbiddenWithObjectRequestAccessClient,
	ResolvedClientUrl,
} from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ForbiddenWithObjectRequestAccessClient('stg')}>
		<Card appearance="inline" showHoverPreview={true} url={ResolvedClientUrl} />
	</SmartCardProvider>
);
