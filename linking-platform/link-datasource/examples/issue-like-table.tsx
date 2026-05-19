import React from 'react';

import { ExampleIssueLikeTableExample } from '../examples-helpers/buildIssueLikeTable';

const visibleColumnKeys = [
	'issuetype',
	'key',
	'summary',
	'link',
	'assignee',
	'people',
	'labels',
	'status',
	'created',
	'description',
	'priority',
	'daterange',
];

export default (): React.JSX.Element => {
	return (
		<ExampleIssueLikeTableExample
			initialVisibleColumnKeys={visibleColumnKeys}
			visibleColumnKeys={visibleColumnKeys}
		/>
	);
};
