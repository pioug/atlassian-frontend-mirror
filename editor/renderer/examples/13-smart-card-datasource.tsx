import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card-datasource.adf.json';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

mockDatasourceFetchRequests();

export default function Example() {
	return (
		<SmartCardProvider>
			<Renderer document={document} appearance="full-page" />
		</SmartCardProvider>
	);
}
