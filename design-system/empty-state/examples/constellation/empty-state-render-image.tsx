import React from 'react';

import Button from '@atlaskit/button/new';
import EmptyState from '@atlaskit/empty-state';

import ExampleImageComponent from './example-image-component';

const EmptyStateRenderImageExample = (): React.JSX.Element => {
	return (
		<EmptyState
			header="You don't have access to this work item"
			description="Make sure the work item exists in this project. If it does, ask a project admin for permission to see the project's work items."
			primaryAction={<Button appearance="primary">Request access</Button>}
			renderImage={() => <ExampleImageComponent />}
		/>
	);
};

export default EmptyStateRenderImageExample;
