import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../../src/ui/confluence-search-modal/modal';

mockDatasourceFetchRequests({
	type: 'confluence',
	delayedResponse: false,
	availableSitesOverride: [],
	shouldMockORSBatch: true,
});

export default () => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new SmartLinkClient()}>
			<ConfluenceSearchConfigModal
				datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
				onCancel={() => {}}
				onInsert={() => {}}
			/>
		</SmartCardProvider>
	</IntlProvider>
);
