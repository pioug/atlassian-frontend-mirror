import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { CodeBlock } from '@atlaskit/code';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';
import { type InlineCardAdf } from '@atlaskit/linking-common';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import {
	ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
	type AssetsDatasourceAdf,
	type AssetsDatasourceParameters,
} from '../src';
import JSMAssetsConfigModal from '../src/ui/assets-modal';

mockAssetsClientFetchRequests();

export default (): React.JSX.Element => {
	const [generatedAdf, setGeneratedAdf] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(true);
	const [parameters, setParameters] = useState<AssetsDatasourceParameters>({
		aql: 'dummy aql',
		workspaceId: '',
		schemaId: '1',
	});
	const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[] | undefined>(undefined);

	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);
	const onInsert = (adf: InlineCardAdf | AssetsDatasourceAdf) => {
		if (adf.type === 'blockCard') {
			setParameters(adf.attrs.datasource.parameters);
			setVisibleColumnKeys(adf.attrs.datasource.views[0].properties?.columns.map((c) => c.key));
		}
		setGeneratedAdf(JSON.stringify(adf, null, 2));
		closeModal();
	};

	return (
		<SmartCardProvider client={new SmartLinkClient()}>
			<Button appearance="primary" onClick={toggleIsOpen}>
				Toggle Modal
			</Button>
			{generatedAdf ? (
				<CodeBlock text={generatedAdf} language={'JSON'} testId={'generated-adf'} />
			) : null}
			{showModal && (
				<JSMAssetsConfigModal
					datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
					visibleColumnKeys={visibleColumnKeys}
					parameters={parameters}
					onCancel={closeModal}
					onInsert={onInsert}
				/>
			)}
		</SmartCardProvider>
	);
};
