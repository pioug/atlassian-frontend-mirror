import React from 'react';

import { DatasourceTableViewWithWrappers as DatasourceTableView } from '@atlaskit/link-datasource/datasource-table-view-with-wrappers';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import { ExampleAssetsIssuesTableView } from '../examples-helpers/buildAssetsIssuesTable';
import { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';

mockAssetsClientFetchRequests();

export default (): React.JSX.Element => {
	return (
		<FakeModalDialogContainer>
			<ExampleAssetsIssuesTableView DatasourceTable={DatasourceTableView} />
		</FakeModalDialogContainer>
	);
};
