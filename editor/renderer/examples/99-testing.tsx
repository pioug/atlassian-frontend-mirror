import React from 'react';
import { createRendererWindowBindings } from './helper/testing-setup';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

mockDatasourceFetchRequests({ shouldMockORSBatch: true });

export default function RendererExampleForTests(): React.JSX.Element {
	createRendererWindowBindings(window);
	return <div id="renderer-container" />;
}
