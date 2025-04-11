import React from 'react';

import { VRIssueLikeTable } from './issue-like-table';

export const VRIssueLikeTablePrioritiesLoading = (): JSX.Element => {
	return (
		<VRIssueLikeTable
			mockExecutionDelay={Infinity}
			visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']}
		/>
	);
};

export const VRIssueLikeTablePriorities = (): JSX.Element => {
	return (
		<VRIssueLikeTable visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']} />
	);
};
