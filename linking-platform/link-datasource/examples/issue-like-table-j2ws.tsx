import React from 'react';

import { ExampleIssueLikeTable } from '../examples-helpers/buildIssueLikeTable';

export default () => {
	return (
		<ExampleIssueLikeTable
			visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']}
		/>
	);
};
