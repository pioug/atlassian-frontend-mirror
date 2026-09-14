import React from 'react';

import { withWaitForItem } from '@atlaskit/link-test-helpers';

import { ExampleJiraIssuesTableView } from '../../examples-helpers/buildJiraIssuesTable';
import { HoverableContainer } from '../../examples-helpers/hoverableContainer';

export default function JiraIssuesTable(): React.JSX.Element {
	return (
		<HoverableContainer>
			<ExampleJiraIssuesTableView />
		</HoverableContainer>
	);
}

export const JiraIssuesTableDaterange = (): React.JSX.Element => {
	return (
		<HoverableContainer>
			<ExampleJiraIssuesTableView visibleColumnKeys={['type', 'key', 'summary', 'daterange']} />
		</HoverableContainer>
	);
};

export const JiraIssuesTableNoResults = (): React.JSX.Element => {
	return (
		<HoverableContainer>
			<ExampleJiraIssuesTableView parameters={{ cloudId: '22222', jql: 'order by created DESC' }} />
		</HoverableContainer>
	);
};

export const VRJiraIssueTableHoverable: React.ComponentType<object> = withWaitForItem(
	JiraIssuesTable,
	() => {
		return document.body.querySelector('[data-testid="examples-hoverable-container"]') !== null;
	},
);

export const VRJiraIssueTableDaterangeHoverable: React.ComponentType<object> = withWaitForItem(
	JiraIssuesTableDaterange,
	() => {
		return document.body.querySelector('[data-testid="examples-hoverable-container"]') !== null;
	},
);
