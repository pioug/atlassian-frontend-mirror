import React from 'react';

import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { createRendererWindowBindings } from './helper/testing-setup';

mockDatasourceFetchRequests({ shouldMockORSBatch: true });

export default function RendererExampleForTests(): React.JSX.Element {
	createRendererWindowBindings(window);
	return <div id="renderer-container" />;
}
