import React from 'react';

import { DatasourceTableView } from '@atlaskit/link-datasource';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import { ExampleAssetsIssuesTableView } from '../examples-helpers/buildAssetsIssuesTable';

mockAssetsClientFetchRequests();

export default () => {
	return <ExampleAssetsIssuesTableView DatasourceTable={DatasourceTableView} />;
};
