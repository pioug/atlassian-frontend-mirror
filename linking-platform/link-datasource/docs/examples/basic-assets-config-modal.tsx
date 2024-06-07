import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID, type AssetsDatasourceParameters } from '../../src';
import JSMAssetsConfigModal from '../../src/ui/assets-modal';

mockAssetsClientFetchRequests({ delayedResponse: false });

const mockVisibleColumnKeys = [
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

export default () => {
	const [showModal, setShowModal] = useState(false);
	const [parameters] = useState<AssetsDatasourceParameters>({
		aql: 'dummy aql',
		workspaceId: '',
		schemaId: '1',
	});
	const [visibleColumnKeys] = useState<string[] | undefined>(mockVisibleColumnKeys);

	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);

	return (
		<SmartCardProvider client={new SmartLinkClient()}>
			<Button appearance="primary" onClick={toggleIsOpen}>
				Toggle Modal
			</Button>
			{showModal && (
				<JSMAssetsConfigModal
					datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
					visibleColumnKeys={visibleColumnKeys}
					parameters={parameters}
					onCancel={closeModal}
					onInsert={closeModal}
				/>
			)}
		</SmartCardProvider>
	);
};
