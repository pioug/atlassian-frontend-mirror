import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import {
	ForbiddenWithObjectRequestAccessClient,
	ResolvedClientUrl,
} from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ForbiddenWithObjectRequestAccessClient('stg')}>
		<Card
			appearance="inline"
			showAuthTooltip={true}
			showHoverPreview={true}
			url={ResolvedClientUrl}
		/>
	</SmartCardProvider>
);
