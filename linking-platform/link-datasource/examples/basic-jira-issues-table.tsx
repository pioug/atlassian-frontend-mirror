import React from 'react';

import { DatasourceTableView } from '@atlaskit/link-datasource';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';

export default () => {
	return <ExampleJiraIssuesTableView DatasourceTable={DatasourceTableView} />;
};
