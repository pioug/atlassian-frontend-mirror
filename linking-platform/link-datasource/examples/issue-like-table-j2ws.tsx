import React from 'react';

import { ExampleIssueLikeTableExample } from '../examples-helpers/buildIssueLikeTable';

export default () => {
	return (
		<ExampleIssueLikeTableExample
			visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']}
		/>
	);
};
