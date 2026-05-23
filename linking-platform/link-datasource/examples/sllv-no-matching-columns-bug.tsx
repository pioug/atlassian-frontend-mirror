import React, { useEffect, useState } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import { DatasourceTableView } from '@atlaskit/link-datasource';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';
import { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';

const staleStoredVisibleColumnKeys = ['Story Points', 'Sprint', 'Epic Link'];

const fullSchema = {
	properties: [
		{ key: 'issuekey', title: 'Key', type: 'link' as const },
		{ key: 'issuetype', title: 'Type', type: 'icon' as const },
		{ key: 'summary', title: 'Summary', type: 'string' as const },
		{ key: 'assignee', title: 'Assignee', type: 'user' as const },
		{ key: 'status', title: 'Status', type: 'status' as const },
		{ key: 'priority', title: 'Priority', type: 'icon' as const },
		{ key: 'customfield_10004', title: 'Story Points', type: 'number' as const },
		{ key: 'customfield_10010', title: 'Sprint', type: 'string' as const },
	],
	defaultProperties: ['issuekey', 'issuetype', 'summary', 'status'],
};

const buildItem = (i: number) => ({
	ari: { data: `ari:cloud:jira::issue/${i}` },
	issuekey: {
		data: { url: `https://example.atlassian.net/browse/REPRO-${i}`, text: `REPRO-${i}` },
	},
	issuetype: { data: { source: '', label: 'Story' } },
	summary: { data: `Bug repro item ${i}` },
	assignee: { data: { displayName: 'Jane Smith' } },
	status: { data: { text: 'In Progress', style: { appearance: 'inprogress' } } },
	priority: { data: { source: '', label: 'Medium' } },
	customfield_10004: { data: String(i) },
	customfield_10010: { data: `Sprint ${i}` },
});

const installFullSchemaDataMock = () => {
	const datasourceMatcher = '[^/]+';
	const url = new RegExp(`/gateway/api/object-resolver/datasource/${datasourceMatcher}/fetch/data`);

	fetchMock.post(
		url,
		async () => ({
			meta: {
				access: 'granted' as const,
				providerName: 'Jira',
				auth: [],
				destinationObjectTypes: ['issue'],
				visibility: 'public',
				definitionId: 'd1',
				key: 'object-provider',
				product: 'jira',
			},
			data: {
				items: [buildItem(1), buildItem(2), buildItem(3)],
				nextPageCursor: undefined,
				schema: fullSchema,
				totalCount: 3,
			},
		}),
		{ overwriteRoutes: true },
	);
};

const useInstallMocks = () => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		fetchMock.restore();
		installFullSchemaDataMock();
		mockDatasourceFetchRequests();
		setReady(true);
	}, []);
	return ready;
};

export default (): React.JSX.Element => {
	const ready = useInstallMocks();
	if (!ready) {
		return <div>Installing mocks…</div>;
	}
	return (
		<FakeModalDialogContainer>
			<ExampleJiraIssuesTableView
				DatasourceTable={DatasourceTableView}
				visibleColumnKeys={staleStoredVisibleColumnKeys}
				mockDatasourceFetchRequest={false}
			/>
		</FakeModalDialogContainer>
	);
};
