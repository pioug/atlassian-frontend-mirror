import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import {
	defaultInitialVisibleConfluenceColumnKeys,
	mockBasicFilterAGGFetchRequests,
	mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../../src/ui/confluence-search-modal/modal/ConfluenceSearchConfigModal';

mockDatasourceFetchRequests({
	type: 'confluence',
	delayedResponse: false,
	shouldMockORSBatch: true,
});
mockBasicFilterAGGFetchRequests();

const parameters = {
	cloudId: '67899',
};

const ConfluenceSearchConfigModalDisableSiteSelector = (): React.JSX.Element => {
	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<ConfluenceSearchConfigModal
					datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
					visibleColumnKeys={defaultInitialVisibleConfluenceColumnKeys}
					parameters={parameters}
					onCancel={() => {}}
					onInsert={() => {}}
					disableSiteSelector
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default ConfluenceSearchConfigModalDisableSiteSelector;
