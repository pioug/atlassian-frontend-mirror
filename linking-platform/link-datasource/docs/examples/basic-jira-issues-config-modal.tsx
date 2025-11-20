import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	defaultInitialVisibleJiraColumnKeys,
	mockBasicFilterAGGFetchRequests,
	mockDatasourceFetchRequests,
	mockProductsData,
	mockSiteData,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID, JiraIssuesConfigModal } from '../../src';

mockDatasourceFetchRequests({
	delayedResponse: false,
	shouldMockORSBatch: true,
	availableSitesOverride: mockSiteData
		.map((site, index) => ({
			...site,
			cloudId: index === 0 ? 'doc-cloudId' : site.cloudId,
		}))
		.filter((site) => !['test1', 'test2', 'test4'].includes(site.displayName)),
	accessibleProductsOverride: mockProductsData
		.filter((product) => ['jira-servicedesk.ondemand'].includes(product.productId))
		.flatMap((product) => ({
			...product,
			workspaces: product.workspaces?.map((workspace, index) => ({
				...workspace,
				cloudId: index === 0 ? 'doc-cloudId' : workspace.cloudId,
			})),
		})),
});
mockBasicFilterAGGFetchRequests({ withJiraFilterHydration: false });

export default (): React.JSX.Element => {
	const [showModal, setShowModal] = useState(false);
	const [visibleColumnKeys] = useState<string[] | undefined>(defaultInitialVisibleJiraColumnKeys);
	const [columnCustomSizes] = useState<{ [key: string]: number } | undefined>();
	const [wrappedColumnKeys] = useState<string[] | undefined>();

	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);
	const closeModal = () => setShowModal(false);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<Button appearance="primary" onClick={toggleIsOpen}>
					Toggle Modal
				</Button>
				{showModal && (
					<JiraIssuesConfigModal
						datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
						visibleColumnKeys={visibleColumnKeys}
						columnCustomSizes={columnCustomSizes}
						wrappedColumnKeys={wrappedColumnKeys}
						parameters={{ cloudId: 'doc-cloudId' }}
						onCancel={closeModal}
						onInsert={closeModal}
					/>
				)}
			</SmartCardProvider>
		</IntlProvider>
	);
};
