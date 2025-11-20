import React from 'react';

import { ExampleIssueLikeTableExample } from '../examples-helpers/buildIssueLikeTable';

export default (): React.JSX.Element => {
	return (
		<ExampleIssueLikeTableExample
			visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']}
		/>
	);
};
