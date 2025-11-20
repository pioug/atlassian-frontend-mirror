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

export const JiraIssuesTableDaterange = () => {
	return (
		<HoverableContainer>
			<ExampleJiraIssuesTableView visibleColumnKeys={['type', 'key', 'summary', 'daterange']} />
		</HoverableContainer>
	);
};

export const VRJiraIssueTableHoverable = withWaitForItem(JiraIssuesTable, () => {
	return document.body.querySelector('[data-testid="examples-hoverable-container"]') !== null;
});

export const VRJiraIssueTableDaterangeHoverable = withWaitForItem(JiraIssuesTableDaterange, () => {
	return document.body.querySelector('[data-testid="examples-hoverable-container"]') !== null;
});
