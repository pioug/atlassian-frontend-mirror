import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	defaultInitialVisibleConfluenceColumnKeys,
	mockBasicFilterAGGFetchRequests,
	mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../../src/ui/confluence-search-modal/modal';

mockDatasourceFetchRequests({
	type: 'confluence',
	delayedResponse: false,
	shouldMockORSBatch: true,
});
mockBasicFilterAGGFetchRequests();

const parameters = {
	cloudId: '44444',
	searchString: 'find me something',
};

export const ConfigSearchConfigModalUnauthorizedEditState = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new SmartLinkClient()}>
			<ConfluenceSearchConfigModal
				datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
				url="https://test7.atlassian.net"
				onCancel={() => {}}
				onInsert={() => {}}
				parameters={parameters}
				visibleColumnKeys={defaultInitialVisibleConfluenceColumnKeys}
			/>
		</SmartCardProvider>
	</IntlProvider>
);

export default ConfigSearchConfigModalUnauthorizedEditState;
