import React from 'react';

import Button from '@atlaskit/button/new';
import EmptyState from '@atlaskit/empty-state';

import LockClosedImage from '../images/LockClosed.png';

const EmptyStateWithHeadingProps = (): React.JSX.Element => {
	return (
		<EmptyState
			header="You don't have access to this work item"
			description="Make sure the work item exists in this project. If it does, ask a project admin for permission to see the project's work items."
			headingLevel={2}
			primaryAction={<Button appearance="primary">Request access</Button>}
			imageUrl={LockClosedImage}
		/>
	);
};

export default EmptyStateWithHeadingProps;
