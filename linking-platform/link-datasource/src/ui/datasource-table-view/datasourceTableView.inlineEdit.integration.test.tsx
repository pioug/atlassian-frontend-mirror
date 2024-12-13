import React from 'react';

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import type {
	AtomicActionInterface,
	DatasourceDataResponseItem,
	DatasourceDataSchema,
} from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DatasourceExperienceIdProvider } from '../../contexts/datasource-experience-id';

import {
	mockActionKey,
	mockActionsDiscoveryEndpoint,
	mockFetchDatasourceDataEndpoint,
} from './__tests__/_utils';
import { DatasourceTableView } from './datasourceTableView';

ffTest.on('enable_datasource_react_sweet_state', 'requires sweet state', () => {
	const integrationKey = 'acme';
	const ari = 'ari:cloud:platform::site/123';

	type ItemMock = {
		ari: string;
		key: string;
		url: string;
		summary: string;
	};

	const mockFetchDatasourceData = (mockItems: ItemMock[]) => {
		const items = mockItems.map(
			(item) =>
				({
					ari: { data: item.ari },
					key: {
						data: {
							url: item.url,
							text: item.key,
						},
					},
					summary: { data: item.summary },
				}) as DatasourceDataResponseItem,
		);

		const schema: DatasourceDataSchema = {
			properties: [
				{
					key: 'key',
					type: 'link',
					title: 'Key',
				},
				{
					key: 'summary',
					type: 'string',
					title: 'Summary',
				},
			],
		};

		mockFetchDatasourceDataEndpoint({
			meta: {
				product: integrationKey,
				destinationObjectTypes: ['issue'],
				objectTypesEntity: 'work-item',
			},
			data: {
				items,
				schema,
			},
		});
	};

	const mockActionsDiscovery = (mockItems: ItemMock[]) => {
		const actions: AtomicActionInterface[] = [
			{
				integrationKey: integrationKey,
				actionKey: mockActionKey('summary'),
				fieldKey: 'summary',
				type: 'string',
			},
		];
		const permissions = mockItems.map((item) => ({
			ari: item.ari,
			isEditable: true,
			fieldKey: 'summary',
		}));

		mockActionsDiscoveryEndpoint({
			actions,
			permissions: {
				data: permissions,
			},
		});
	};

	const mockedFetch = jest.fn();
	class MockSmartLinkClient extends CardClient {
		prefetchData = mockedFetch;
		fetchData = mockedFetch;
	}

	const mockSmartCardResolve = (url: string, summary: string) => {
		mockedFetch.mockResolvedValueOnce({
			meta: {
				auth: [],
				visibility: 'restricted',
				access: 'granted',
				resourceType: 'issue',
			},
			data: {
				generator: {
					'@type': 'Application',
					'@id': 'https://www.atlassian.com/#Jira',
					name: 'Jira',
				},
				'@type': ['atlassian:Task', 'Object'],
				name: summary,
				url,
			},
		});
	};

	const userVisitDatasourceTable = async (
		props: Partial<React.ComponentProps<typeof DatasourceTableView>> = {
			visibleColumnKeys: ['key', 'summary'],
		},
	) => {
		await act(async () => {
			render(
				<DatasourceTableView
					datasourceId="datasource"
					parameters={{
						cloudId: 'some-cloud-id',
						jql: 'some-jql-query',
					}}
					{...props}
				/>,
				{
					wrapper: ({ children }) => (
						<DatasourceExperienceIdProvider>
							<SmartCardProvider client={new MockSmartLinkClient()}>
								<IntlProvider locale="en">{children}</IntlProvider>
							</SmartCardProvider>
						</DatasourceExperienceIdProvider>
					),
				},
			);
		});
	};

	const userVisitHoverCardForIssueKey = () => {
		fireEvent.mouseOver(screen.getByTestId('hover-card-trigger-wrapper'));
		act(() => {
			jest.runAllTimers();
		});
	};
	const closeHoverCard = () => {
		fireEvent.mouseLeave(screen.getByTestId('hover-card-trigger-wrapper'));
		act(() => {
			jest.runAllTimers();
		});
	};

	const userUpdateIssueSummaryViaInlineEdit = async (oldSummary: string, newSummary: string) => {
		await act(async () => {
			within(screen.getByTestId('datasource-table-view')).getByText(oldSummary).click();
		});
		const inlineEdit = screen.getByTestId('inline-edit-text');

		// this mock represents that the backend jira issue has changed as part of the inline-edit submission
		// the smart card cache will be refreshed at the time inline edit submit
		// therefore this mock has to be updated before triggering submit event.
		mockSmartCardResolve('https://acme.atlassian.net/browse/EDM-1000', newSummary);

		await act(async () => {
			fireEvent.change(inlineEdit, {
				target: { value: newSummary },
				currentTarget: { value: newSummary },
			});
		});
		await act(async () => {
			fireEvent.submit(inlineEdit);
		});
	};

	const givenADatasourceTableWithASingleJiraIssue = ({
		key,
		url,
		summary,
	}: {
		key: string;
		url: string;
		summary: string;
	}) => {
		mockFetchDatasourceData([{ ari, key, url, summary }]);
		mockActionsDiscovery([{ ari, key, url, summary }]);
		mockSmartCardResolve(url, summary);
	};

	const OLD_SUMMARY = 'Old Summary';
	const NEW_SUMMARY = 'New Summary';

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('should update hover card in key column when the user update summary via j2ws', async () => {
		givenADatasourceTableWithASingleJiraIssue({
			key: 'EDM-1000',
			url: 'https://acme.atlassian.net/browse/EDM-1000',
			summary: OLD_SUMMARY,
		});

		await userVisitDatasourceTable();

		userVisitHoverCardForIssueKey(); // visit hover card once so that smart card cache is populated
		closeHoverCard();

		await userUpdateIssueSummaryViaInlineEdit(OLD_SUMMARY, NEW_SUMMARY);

		userVisitHoverCardForIssueKey(); // visit hover card again, it should have been updated
		expect(screen.getByTestId('smart-element-link')).toHaveTextContent(NEW_SUMMARY);
	});

	it('should not throw error when the user update summary via j2ws, and the key column is not visible', async () => {
		givenADatasourceTableWithASingleJiraIssue({
			key: 'EDM-1000',
			url: 'https://acme.atlassian.net/browse/EDM-1000',
			summary: OLD_SUMMARY,
		});

		await userVisitDatasourceTable({ visibleColumnKeys: ['summary'] });

		await userUpdateIssueSummaryViaInlineEdit(OLD_SUMMARY, NEW_SUMMARY);

		// summary should have been updated without error
		expect(screen.getByTestId('inline-edit-read-view')).toHaveTextContent(NEW_SUMMARY);
	});
});
