import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card-datasource.adf.json';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import type { DocNode } from '@atlaskit/adf-schema/schema';

mockDatasourceFetchRequests();

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider>
			<Renderer document={document as DocNode} appearance="full-page" />
		</SmartCardProvider>
	);
}
