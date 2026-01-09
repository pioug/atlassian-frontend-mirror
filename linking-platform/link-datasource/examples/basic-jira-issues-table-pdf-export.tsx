import React from 'react';


import { DatasourceTableView } from '@atlaskit/link-datasource';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';
import { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';

export default (): React.JSX.Element => {
	return (
		<FakeModalDialogContainer>
			<ExampleJiraIssuesTableView
				DatasourceTable={DatasourceTableView}
				visibleColumnKeys={['type', 'key', 'summary', 'link', 'assignee']}
				shouldControlDataExport={true}
			/>
		</FakeModalDialogContainer>
	);
};
