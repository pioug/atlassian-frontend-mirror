import React from 'react';

import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';
import type { DatasourceDataResponse } from '@atlaskit/linking-types/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../../src/ui/assets-modal';
import { AssetsConfigModalWithWrappers as JSMAssetsConfigModal } from '../../src/ui/assets-modal/AssetsConfigModalWithWrappers';
import { type AssetsDatasourceParameters } from '../../src/ui/assets-modal/types';

const avatarUrl = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0C66E4"/><path d="M7 17 12 7l5 10h-3l-2-4-2 4Z" fill="white"/></svg>',
)}`;

const objectReferenceResponse: DatasourceDataResponse = {
	meta: {
		access: 'granted',
		auth: [],
		destinationObjectTypes: ['assets'],
		extensionKey: 'jsm-cmdb-gateway',
		visibility: 'restricted',
	},
	data: {
		items: [
			{
				Key: {
					data: {
						url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1338',
						text: 'LSD-1338',
					},
				},
				Applications: {
					data: {
						url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1333',
						text: 'Application 3',
						avatarUrl,
					},
				},
			},
			{
				Key: {
					data: {
						url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1339',
						text: 'LSD-1339',
					},
				},
				Applications: {
					data: {
						url: 'https://test-instance.atlassian.net/jira/servicedesk/assets/object/1334',
						text: 'Application 4',
						avatarUrl,
					},
				},
			},
		],
		totalCount: 2,
		schema: {
			properties: [
				{
					key: 'Key',
					type: 'link',
					title: 'Key',
					isList: false,
				},
				{
					key: 'Applications',
					type: 'objectReference',
					title: 'Applications',
					isList: false,
				},
			],
			defaultProperties: ['Key', 'Applications'],
		},
	},
};

fetchMock.once(
	new RegExp(
		`/gateway/api/object-resolver/datasource/${ASSETS_LIST_OF_LINKS_DATASOURCE_ID}/fetch/data`,
	),
	objectReferenceResponse,
);
mockAssetsClientFetchRequests({ delayedResponse: false });

const mockParameters: AssetsDatasourceParameters = {
	aql: 'dummy aql',
	workspaceId: '',
	schemaId: '1',
};

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new SmartLinkClient()}>
			<JSMAssetsConfigModal
				datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
				visibleColumnKeys={['Key', 'Applications']}
				parameters={mockParameters}
				onCancel={() => {}}
				onInsert={() => {}}
			/>
		</SmartCardProvider>
	</IntlProvider>
);
