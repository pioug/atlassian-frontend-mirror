import React from 'react';

import { withWaitForItem } from '../utils/withWaitForItem';

import { VRIssueLikeTable } from './issue-like-table';

export const VRIssueLikeTableStatusLoading = withWaitForItem(
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
			document.body.querySelector('[data-testid="link-datasource-render-type--status"]') !== null
		);
	},
);

export const VRIssueLikeTableStatus = withWaitForItem(
	(): JSX.Element => {
		return (
			<VRIssueLikeTable visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']} />
		);
	},
	() => {
		return (
			document.body.querySelector('[data-testid="link-datasource-render-type--status"]') !== null
		);
	},
);
