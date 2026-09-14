import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import {
	ForbiddenWithObjectRequestAccessClient,
	ResolvedClientUrl,
} from '@atlaskit/link-test-helpers';

import { Card } from '../../src';

export default (): React.JSX.Element => (
	<SmartCardProvider client={new ForbiddenWithObjectRequestAccessClient('stg')}>
		<Card appearance="inline" showHoverPreview={true} url={ResolvedClientUrl} />
	</SmartCardProvider>
);
