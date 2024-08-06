import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { mockActionsDiscoveryEmptyResponse } from '@atlaskit/link-client-extension';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	mockActionsDiscovery,
	ORS_ACTIONS_DISCOVERY_ENDPOINT,
} from '@atlaskit/link-test-helpers/datasource';
import { type AtomicActionInterface, type DatasourceDataResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DatasourceExperienceIdProvider } from '../../contexts/datasource-experience-id';
import { ActionsStore } from '../../state/actions';

import { DatasourceTableView } from './datasourceTableView';

jest.mock('@atlaskit/link-client-extension', () => {
	const originalModule = jest.requireActual('@atlaskit/link-client-extension');
	return {
		...originalModule,
		useDatasourceClientExtension: jest.fn(() => {
			const result = originalModule.useDatasourceClientExtension();

			/**
			 * The below overrides force new requests for all datasource + actions discovery requests
			 */
			return {
				...result,
				getDatasourceData: (datasourceId: any, data: any, force: any) =>
					result.getDatasourceData(datasourceId, data, true),
				getDatasourceActionsAndPermissions: (data: any, force: any) =>
					result.getDatasourceActionsAndPermissions(data, true),
			};
		}),
	};
});

ffTest.on('enable_datasource_react_sweet_state', 'requires sweet state', () => {
	const ORS_FETCH_DATASOURCE_DATA_ENDPOINT =
		/\/gateway\/api\/object\-resolver\/datasource\/[^/]+\/fetch\/data/;

	describe('2-way sync', () => {
		const actionsStore = defaultRegistry.getStore(ActionsStore);
		const mockFetchDatasourceData = (overrides: {
			meta: Partial<DatasourceDataResponse['meta']>;
			data: DatasourceDataResponse['data'];
		}) => {
			fetchMock.post(
				ORS_FETCH_DATASOURCE_DATA_ENDPOINT,
				async (): Promise<DatasourceDataResponse> => ({
					meta: {
						access: 'granted',
						providerName: 'Acme',
						visibility: 'restricted',
						...overrides.meta,
					},
					data: overrides.data,
				}),
			);
		};

		beforeEach(() => {
			actionsStore.storeState.resetState();
			fetchMock.reset();
		});

		const renderTable = (props: Partial<React.ComponentProps<typeof DatasourceTableView>> = {}) => {
			return render(
				<DatasourceTableView
					datasourceId="datasource"
					parameters={{
						cloudId: 'some-cloud-id',
						jql: 'some-jql-query',
					}}
					visibleColumnKeys={['summary']}
					{...props}
				/>,
				{
					wrapper: ({ children }) => (
						<DatasourceExperienceIdProvider>
							<SmartCardProvider>
								<IntlProvider locale="en">{children}</IntlProvider>
							</SmartCardProvider>
						</DatasourceExperienceIdProvider>
					),
				},
			);
		};

		const acmeSummaryUpdateAction = {
			integrationKey: 'acme',
			actionKey: 'atlassian:issue:update:summary',
			fieldKey: 'summary',
			type: 'string',
		} satisfies AtomicActionInterface;

		const ari = 'ari:cloud:platform::site/123';

		const createDatasourceDataFromItems = (
			items: DatasourceDataResponse['data']['items'],
		): DatasourceDataResponse['data'] => {
			return {
				items,
				schema: {
					properties: Array.from(new Set(items.flatMap((item) => Object.keys(item)))).map(
						(key) => ({
							key,
							type: 'string',
							title: key,
						}),
					),
				},
			};
		};

		ffTest.on('platform-datasources-enable-two-way-sync', 'when jaws enabled', () => {
			it('cells should not be editable when there are no update actions available', async () => {
				mockFetchDatasourceData({
					data: createDatasourceDataFromItems([
						{
							ari: { data: ari },
							summary: { data: 'Hello world' },
						},
					]),
					meta: {
						product: 'acme',
					},
				});
				mockActionsDiscovery(mockActionsDiscoveryEmptyResponse);

				renderTable();
				await screen.findByRole('cell', { name: 'Hello world' });

				await waitFor(() => {
					expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(true);
				});

				expect(actionsStore.storeState.getState()).toStrictEqual({
					actionsByIntegration: {},
					permissions: {},
				});
			});

			it('cells should not be editable when there are actions, but the user does not have sufficient permission to edit', async () => {
				mockFetchDatasourceData({
					data: createDatasourceDataFromItems([
						{
							ari: { data: ari },
							summary: { data: 'Hello world' },
						},
					]),
					meta: {
						product: 'acme',
					},
				});
				mockActionsDiscovery({
					actions: [acmeSummaryUpdateAction],
					permissions: {
						data: [],
					},
				});

				renderTable();
				await screen.findByRole('cell', { name: 'Hello world' });

				await waitFor(() => {
					expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(true);
				});

				expect(actionsStore.storeState.getState()).toStrictEqual({
					actionsByIntegration: {
						[acmeSummaryUpdateAction.integrationKey]: {
							[acmeSummaryUpdateAction.fieldKey]: {
								actionKey: acmeSummaryUpdateAction.actionKey,
								type: acmeSummaryUpdateAction.type,
							},
						},
					},
					permissions: {},
				});
			});

			it('cells should be editable when user has sufficient permission to perform an update', async () => {
				const ari = 'ari:cloud:platform::site/1234';
				mockFetchDatasourceData({
					data: createDatasourceDataFromItems([
						{
							ari: { data: ari },
							summary: { data: 'Hello world' },
						},
					]),
					meta: {
						product: 'acme',
					},
				});
				mockActionsDiscovery({
					actions: [acmeSummaryUpdateAction],
					permissions: {
						data: [
							{
								ari,
								isEditable: true,
								fieldKey: acmeSummaryUpdateAction.fieldKey,
							},
						],
					},
				});

				renderTable();

				await screen.findByRole('cell', { name: 'Hello world' });

				await waitFor(() => {
					expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(true);
				});

				expect(actionsStore.storeState.getState()).toStrictEqual({
					actionsByIntegration: {
						[acmeSummaryUpdateAction.integrationKey]: {
							[acmeSummaryUpdateAction.fieldKey]: {
								actionKey: acmeSummaryUpdateAction.actionKey,
								type: acmeSummaryUpdateAction.type,
							},
						},
					},
					permissions: {
						[ari]: {
							[acmeSummaryUpdateAction.fieldKey]: {
								isEditable: true,
							},
						},
					},
				});
			});
		});

		ffTest.off('platform-datasources-enable-two-way-sync', 'when jaws disabled', () => {
			it('cells should not be editable', async () => {
				mockFetchDatasourceData({
					data: createDatasourceDataFromItems([
						{
							ari: { data: ari },
							summary: { data: 'Hello world' },
						},
					]),
					meta: {
						product: 'acme',
					},
				});
				mockActionsDiscovery({
					actions: [
						{
							integrationKey: 'jira',
							actionKey: 'atlassian:issue:update:summary',
							fieldKey: 'summary',
							type: 'string',
						},
					],
					permissions: {
						data: [
							{
								ari: 'ari:cloud:platform::site/123',
								isEditable: true,
								fieldKey: 'summary',
							},
						],
					},
				});

				renderTable();

				await screen.findByRole('cell', { name: 'Hello world' });

				expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(false);
				expect(actionsStore.storeState.getState()).toStrictEqual({
					actionsByIntegration: {},
					permissions: {},
				});
			});
		});
	});
});
