import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';

import { Card } from '../../src';

export default (): React.JSX.Element => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Card appearance="block" url={ResolvedClientUrl} />
	</SmartCardProvider>
);
