import React from 'react';

import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import { ExampleAssetsIssuesTableView } from '../examples-helpers/buildAssetsIssuesTable';

mockAssetsClientFetchRequests();

export default () => {
	return <ExampleAssetsIssuesTableView />;
};
