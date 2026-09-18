import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card-datasource.adf.json';

mockDatasourceFetchRequests();

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider>
			<Renderer document={document as DocNode} appearance="full-page" />
		</SmartCardProvider>
	);
}
