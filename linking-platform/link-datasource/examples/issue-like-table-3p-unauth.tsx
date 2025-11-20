import React from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import { DatasourceTableView } from '@atlaskit/link-datasource';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';

/**
 * Doing this mock here to simulate a user clicking connect and then seeing datasource resolve
 */
fetchMock.once(new RegExp(`/gateway/api/object-resolver/datasource/[^/]+/fetch/data`), () => {
	return new Promise((resolve) => {
		resolve({
			meta: {
				access: 'unauthorized',
				providerName: 'Amplitude',
				auth: [
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'https://id.atlassian.com/login',
					},
				],
			},
			data: {},
		});
	});
});

mockDatasourceFetchRequests({
	delayedResponse: false,
});

export default (): React.JSX.Element => {
	return (
		<ExampleJiraIssuesTableView
			parameters={{
				cloudId: '1248349567434',
			}}
			mockDatasourceFetchRequest={false}
			DatasourceTable={DatasourceTableView}
		/>
	);
};
