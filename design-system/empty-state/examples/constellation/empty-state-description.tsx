import React from 'react';

import EmptyState from '@atlaskit/empty-state';

const EmptyStateDescriptionExample = (): React.JSX.Element => {
	return (
		<EmptyState
			header="You don't have access to this work item"
			description="Make sure the work item exists in this project. If it does, ask a project admin for permission to see the project's work items."
		/>
	);
};

export default EmptyStateDescriptionExample;
