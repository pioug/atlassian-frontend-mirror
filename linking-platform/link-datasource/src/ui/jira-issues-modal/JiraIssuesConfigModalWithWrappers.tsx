import React, { lazy, Suspense } from 'react';

import { type JiraConfigModalProps } from './types';

const LazyJiraIssuesConfigModal = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_linkdatasource-jiraissuesmodal" */ './modal'
	).then((module) => ({ default: module.JiraIssuesConfigModal })),
);

export const JiraIssuesConfigModalWithWrappers = (
	props: JiraConfigModalProps,
): React.JSX.Element => {
	return (
		<Suspense fallback={<div data-testid={'jira-datasource-table-suspense'} />}>
			<LazyJiraIssuesConfigModal {...props} />
		</Suspense>
	);
};
