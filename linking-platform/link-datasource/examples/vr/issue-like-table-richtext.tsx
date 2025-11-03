import React from 'react';

import { withWaitForItem } from '@atlaskit/link-test-helpers';

import { ExampleJiraIssuesTableView } from '../../examples-helpers/buildJiraIssuesTable';
import { HoverableContainer } from '../../examples-helpers/hoverableContainer';

export const VRIssueLikeTableRichText = withWaitForItem(
	(): JSX.Element => {
		return (
			<HoverableContainer>
				<ExampleJiraIssuesTableView
					visibleColumnKeys={['key', 'description', 'summary', 'assignee']}
					scrollableContainerHeight={800}
				/>
			</HoverableContainer>
		);
	},
	() => {
		return (
			document.body.querySelector('[data-testid="link-datasource-render-type--user"]') !== null
		);
	},
);
