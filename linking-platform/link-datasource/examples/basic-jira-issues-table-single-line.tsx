import React from 'react';


import { DatasourceTableView } from '@atlaskit/link-datasource';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';
import { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';

export default (): React.JSX.Element => {
	return (
		<FakeModalDialogContainer hasOverflow={false}>
			<ExampleJiraIssuesTableView 
				parameters={{
					cloudId: '11111',
					jql: 'some-jql',
				}}
				visibleColumnKeys={['key', 'summary', 'status', 'assignee', 'priority']} 
				DatasourceTable={DatasourceTableView} 
				// scrollableContainerHeight={0}
			/>
		</FakeModalDialogContainer>
	);
};