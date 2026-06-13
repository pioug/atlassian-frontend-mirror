/** @jsxRuntime classic */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { jsx } from '@compiled/react';
import fetchMock from 'fetch-mock/cjs/client';

import { DatasourceTableView, JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { bug, story, task } from '@atlaskit/link-test-helpers/images';
import { Box } from '@atlaskit/primitives/compiled';

import { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';
import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { DatasourceExperienceIdProvider } from '../src/contexts/datasource-experience-id';

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const columnCustomSizes = {
	key: 120,
	summary: 360,
	status: 140,
	assignee: 180,
	priority: 120,
};

const schema = {
	properties: [
		{ key: 'issuetype', title: 'Type', type: 'icon' as const },
		{ key: 'key', title: 'Key', type: 'link' as const },
		{ key: 'summary', title: 'Summary', type: 'string' as const },
		{ key: 'status', title: 'Status', type: 'status' as const },
		{ key: 'assignee', title: 'Assignee', type: 'user' as const },
		{ key: 'priority', title: 'Priority', type: 'string' as const },
	],
	defaultProperties: ['issuetype', 'key', 'summary', 'status', 'assignee', 'priority'],
};

const visibleColumnKeys = ['issuetype', 'key', 'summary', 'status', 'assignee', 'priority'];

type MockIssue = {
	assignee?: string;
	issuetype: 'Bug' | 'Story' | 'Task';
	key: string;
	priority: 'High' | 'Low' | 'Medium';
	status: 'Done' | 'In Progress' | 'To do';
	summary: string;
};

const issues: MockIssue[] = [
	{
		issuetype: 'Story',
		key: 'SORT-103',
		summary: 'Write migration guide for Jira list sorting',
		status: 'In Progress',
		assignee: 'Priya Shah',
		priority: 'High',
	},
	{
		issuetype: 'Task',
		key: 'SORT-101',
		summary: 'Add renderer-only column sort affordance',
		status: 'To do',
		assignee: 'Alex Chen',
		priority: 'Medium',
	},
	{
		issuetype: 'Bug',
		key: 'SORT-104',
		summary: 'Verify JQL ORDER BY update on header click',
		status: 'Done',
		assignee: 'Sam Lee',
		priority: 'Low',
	},
	{
		issuetype: 'Task',
		key: 'SORT-102',
		summary: 'Keep sorting state non-persistent in renderer',
		status: 'To do',
		priority: 'High',
	},
];

const getOrderBy = (
	jql: unknown,
): { direction: 'ASC' | 'DESC'; field: keyof MockIssue } | undefined => {
	if (typeof jql !== 'string') {
		return undefined;
	}

	const match = jql.match(
		/ORDER\s+BY\s+(issuetype|key|summary|status|assignee|priority)\s+(ASC|DESC)/i,
	);
	if (!match) {
		return undefined;
	}

	return {
		field: match[1].toLowerCase() as keyof MockIssue,
		direction: match[2].toUpperCase() as 'ASC' | 'DESC',
	};
};

const getSortedIssues = (jql: unknown) => {
	const orderBy = getOrderBy(jql);
	if (!orderBy) {
		return issues;
	}

	return [...issues].sort((issueA, issueB) => {
		const a = issueA[orderBy.field] ?? '';
		const b = issueB[orderBy.field] ?? '';
		const result = String(a).localeCompare(String(b));

		return orderBy.direction === 'ASC' ? result : -result;
	});
};

const getStatusAppearance = (status: MockIssue['status']) => {
	if (status === 'Done') {
		return 'success';
	}
	if (status === 'In Progress') {
		return 'inprogress';
	}
	return 'default';
};

const getIssueTypeIcon = (issueType: MockIssue['issuetype']) => {
	if (issueType === 'Bug') {
		return bug;
	}
	if (issueType === 'Task') {
		return task;
	}
	return story;
};

const installMocks = (mockDataRequestLatencyMs: number) => {
	fetchMock.restore();

	fetchMock.post(/object-resolver\/datasource\/[^/]+\/fetch\/details/, async () => ({
		meta: {
			auth: [],
			definitionId: 'jira-object-provider',
			destinationObjectTypes: ['issue'],
			key: 'jira-object-provider',
			product: 'jira',
			providerName: 'Jira',
			visibility: 'restricted',
		},
		data: {
			schema,
		},
	}));

	fetchMock.post(
		/gateway\/api\/object-resolver\/datasource\/[^/]+\/fetch\/data/,
		async (_url: string, request: { body?: string }) => {
			const body = request.body ? JSON.parse(request.body) : {};
			const sortedIssues = getSortedIssues(body.parameters?.jql);

			if (mockDataRequestLatencyMs > 0) {
				await delay(mockDataRequestLatencyMs);
			}

			return {
				meta: {
					access: 'granted' as const,
					auth: [],
					definitionId: 'jira-object-provider',
					destinationObjectTypes: ['issue'],
					key: 'jira-object-provider',
					objectTypesEntity: 'work-item',
					product: 'jira',
					providerName: 'Jira',
					visibility: 'restricted',
				},
				data: {
					items: sortedIssues.map((issue) => ({
						ari: { data: `ari:cloud:jira:example:issue/${issue.key}` },
						issuetype: {
							data: {
								label: issue.issuetype,
								source: getIssueTypeIcon(issue.issuetype),
							},
						},
						key: {
							data: {
								style: { appearance: 'key' },
								text: issue.key,
								url: `https://example.atlassian.net/browse/${issue.key}`,
							},
						},
						summary: { data: issue.summary },
						status: {
							data: {
								style: { appearance: getStatusAppearance(issue.status) },
								text: issue.status,
							},
						},
						assignee: {
							data: {
								displayName: issue.assignee,
							},
						},
						priority: { data: issue.priority },
					})),
					schema,
					totalCount: sortedIssues.length,
				},
			};
		},
	);
};

const useInstallMocks = (mockDataRequestLatencyMs: number) => {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		installMocks(mockDataRequestLatencyMs);
		setReady(true);
	}, [mockDataRequestLatencyMs]);

	return ready;
};

export default (): React.JSX.Element => {
	return <SortableJiraIssuesTable />;
};

type SortableJiraIssuesTableProps = {
	jql?: string;
	mockDataRequestLatencyMs?: number;
};

export const SortableJiraIssuesTable = ({
	jql = 'project = SORT',
	mockDataRequestLatencyMs = 800,
}: SortableJiraIssuesTableProps = {}): React.JSX.Element => {
	const ready = useInstallMocks(mockDataRequestLatencyMs);

	if (!ready) {
		return <Box padding="space.200">Installing mocks…</Box>;
	}

	return (
		<DatasourceExperienceIdProvider>
			<SmartCardProvider client={new SmartLinkClient()}>
				<FakeModalDialogContainer hasOverflow={false}>
					<DatasourceTableView
						datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
						parameters={{
							cloudId: 'sortable-jira-example-cloud-id',
							jql,
						}}
						visibleColumnKeys={visibleColumnKeys}
						columnCustomSizes={columnCustomSizes}
					/>
				</FakeModalDialogContainer>
			</SmartCardProvider>
		</DatasourceExperienceIdProvider>
	);
};

export const SortableJiraIssuesTableNoLatency = ({
	jql = 'project = SORT',
}: SortableJiraIssuesTableProps = {}): React.JSX.Element => {
	return <SortableJiraIssuesTable jql={jql} mockDataRequestLatencyMs={0} />;
};
