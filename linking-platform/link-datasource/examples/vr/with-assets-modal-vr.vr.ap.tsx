import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { type AssetsDatasourceParameters } from '../../src/ui/assets-modal/types';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../../src/ui/assets-modal';
import { AssetsConfigModalWithWrappers as JSMAssetsConfigModal } from '../../src/ui/assets-modal/AssetsConfigModalWithWrappers';

mockAssetsClientFetchRequests({ delayedResponse: false });

const mockParameters: AssetsDatasourceParameters = {
	aql: 'dummy aql',
	workspaceId: '',
	schemaId: '1',
};

const visibleColumnKeys = [
	'Key',
	'Label',
	'Created',
	'Is Virtual',
	'Hardware Components',
	'Applications',
	'Software Services',
	'Number of Slots',
	'Primary Capability',
	'Owners',
	'Notes',
];

export default (): React.JSX.Element => {
	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<JSMAssetsConfigModal
					datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
					visibleColumnKeys={visibleColumnKeys}
					parameters={mockParameters}
					onCancel={() => {}}
					onInsert={() => {}}
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
};
