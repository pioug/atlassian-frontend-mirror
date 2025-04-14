import React from 'react';

import { ExampleJiraIssuesTableView } from '../../examples-helpers/buildJiraIssuesTable';
import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import { withWaitForItem } from '../utils/withWaitForItem';

export default function JiraIssuesTable() {
	return (
		<HoverableContainer>
			<ExampleJiraIssuesTableView />
		</HoverableContainer>
	);
}

export const VRJiraIssueTableHoverable = withWaitForItem(JiraIssuesTable, () => {
	return document.body.querySelector('[data-testid="examples-hoverable-container"]') !== null;
});
