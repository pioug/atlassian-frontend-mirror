import React from 'react';

import { withWaitForItem } from '@atlaskit/link-test-helpers';

import { VRIssueLikeTable } from './issue-like-table';

export const VRIssueLikeTablePrioritiesLoading = withWaitForItem(
	(): JSX.Element => {
		return (
			<VRIssueLikeTable
				mockExecutionDelay={Infinity}
				visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']}
			/>
		);
	},
	() => {
		return (
			document.body.querySelector('[data-testid="link-datasource-render-type--icon"]') !== null
		);
	},
);

export const VRIssueLikeTablePriorities = withWaitForItem(
	(): JSX.Element => {
		return (
			<VRIssueLikeTable visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']} />
		);
	},
	() => {
		return (
			document.body.querySelector('[data-testid="link-datasource-render-type--icon"]') !== null
		);
	},
);
