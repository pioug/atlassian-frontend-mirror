import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { mockActionsDiscoveryEmptyResponse } from '@atlaskit/link-client-extension';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { MockIntersectionObserverFactory } from '@atlaskit/link-test-helpers';
import { ORS_ACTIONS_DISCOVERY_ENDPOINT } from '@atlaskit/link-test-helpers/datasource';
import {
	type AtomicActionInterface,
	type DatasourceDataResponseItem,
	type DatasourceDataSchema,
} from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DatasourceExperienceIdProvider } from '../../contexts/datasource-experience-id';
import { ActionsStore } from '../../state/actions';

import {
	mockActionKey,
	mockActionsDiscoveryEndpoint,
	mockFetchDatasourceDataEndpoint,
} from './__tests__/_utils';
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
	describe('2-way sync', () => {
		const actionsStore = defaultRegistry.getStore(ActionsStore);

		type ItemWithPermissionMock = {
			ari: string;
			fieldKey: string;
			fieldValue: string;
			isEditable: boolean;
		};

		const mockFetchDatasourceData = (mockItems: ItemWithPermissionMock[], hasNextPage = false) => {
			const items = mockItems.map((item) => {
				const dataItem: DatasourceDataResponseItem = { ari: { data: item.ari } };
				dataItem[item.fieldKey] = { data: item.fieldValue };
				return dataItem;
			});

			const schema: DatasourceDataSchema = {
				properties: Array.from(new Set(items.flatMap((item) => Object.keys(item)))).map((key) => ({
					key,
					type: 'string',
					title: key,
				})),
			};

			mockFetchDatasourceDataEndpoint({
				meta: {
					product: 'acme',
					destinationObjectTypes: ['issue'],
					objectTypesEntity: 'work-item',
				},
				data: {
					items,
					schema,
					nextPageCursor: hasNextPage ? 'next-cursor' : undefined,
				},
			});
		};

		const mockActionsDiscovery = (mockItems: ItemWithPermissionMock[], integrationKey: string) => {
			const actions: AtomicActionInterface[] = Array.from(
				new Set(mockItems.map((item) => item.fieldKey)),
			).map((fieldKey) => ({
				integrationKey: integrationKey,
				actionKey: mockActionKey(fieldKey),
				fieldKey,
				type: 'string',
			}));
			const permissions = mockItems
				.filter((item) => item.isEditable)
				.map((item) => ({
					ari: item.ari,
					isEditable: item.isEditable,
					fieldKey: item.fieldKey,
				}));

			mockActionsDiscoveryEndpoint({
				actions,
				permissions: {
					data: permissions,
				},
			});
		};

		const mockOnePageOfItemsWithPermissions = ({
			items,
			integrationKey,
			hasNextPage = false,
		}: {
			items: ItemWithPermissionMock[];
			integrationKey: string;
			hasNextPage?: boolean;
		}) => {
			mockFetchDatasourceData(items, hasNextPage);
			mockActionsDiscovery(items, integrationKey);
		};

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

		const ari = 'ari:cloud:platform::site/123';
		const alternateAri = 'ari:cloud:platform::site/456';

		beforeEach(() => {
			actionsStore.storeState.resetState();
			fetchMock.reset();
		});

		ffTest.on('platform-datasources-enable-two-way-sync', 'when jaws enabled', () => {
			it('cells should not be editable when there are no update actions available', async () => {
				mockFetchDatasourceData([
					{
						ari: ari,
						fieldKey: 'summary',
						fieldValue: 'Hello world',
						isEditable: true,
					},
				]);
				mockActionsDiscoveryEndpoint(mockActionsDiscoveryEmptyResponse);

				renderTable();
				await screen.findByRole('cell', { name: 'Hello world' });

				await waitFor(() => {
					expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(true);
				});

				await waitFor(() => {
					expect(actionsStore.storeState.getState()).toStrictEqual({
						actionsByIntegration: {},
						permissions: {},
					});
				});
			});

			it('cells should not be editable when there are actions, but the user does not have sufficient permission to edit', async () => {
				mockOnePageOfItemsWithPermissions({
					items: [
						{
							ari: ari,
							fieldKey: 'summary',
							fieldValue: 'Hello world',
							isEditable: false,
						},
					],
					integrationKey: 'acme',
				});

				renderTable();
				await screen.findByRole('cell', { name: 'Hello world' });

				await waitFor(() => {
					expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(true);
				});

				await waitFor(() => {
					expect(actionsStore.storeState.getState()).toStrictEqual({
						actionsByIntegration: {
							acme: {
								summary: {
									actionKey: mockActionKey('summary'),
									type: 'string',
								},
							},
						},
						permissions: {},
					});
				});
			});

			it('cells should be editable when user has sufficient permission to perform an update', async () => {
				mockOnePageOfItemsWithPermissions({
					items: [
						{
							ari: ari,
							fieldKey: 'summary',
							fieldValue: 'Hello world',
							isEditable: true,
						},
					],
					integrationKey: 'acme',
				});

				renderTable();

				await screen.findByRole('cell', { name: 'Hello world' });

				await waitFor(() => {
					expect(fetchMock.called(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toBe(true);
				});

				await waitFor(() => {
					expect(actionsStore.storeState.getState()).toStrictEqual({
						actionsByIntegration: {
							acme: {
								summary: {
									actionKey: mockActionKey('summary'),
									type: 'string',
								},
							},
						},
						permissions: {
							[ari]: {
								summary: {
									isEditable: true,
								},
							},
						},
					});
				});
			});

			describe('when scrolling', () => {
				jest.useFakeTimers();
				let systemIntersectionObserver: any;
				let mockGetEntries: any;

				beforeEach(() => {
					systemIntersectionObserver = window.IntersectionObserver;

					mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: false }]);
					const mockIntersectionObserverOpts = {
						disconnect: jest.fn(),
						getMockEntries: mockGetEntries,
					};
					window.IntersectionObserver = MockIntersectionObserverFactory(
						mockIntersectionObserverOpts,
					);
				});

				afterEach(() => {
					window.IntersectionObserver = systemIntersectionObserver;
				});

				const scrollToBottom = () => {
					mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
					act(() => {
						jest.runOnlyPendingTimers();
					});
				};

				it('editable cells should be recognized for items loaded after scrolling', async () => {
					// first page item
					mockOnePageOfItemsWithPermissions({
						items: [
							{
								ari,
								fieldKey: 'summary',
								fieldValue: 'Hello world',
								isEditable: true,
							},
						],
						integrationKey: 'acme',
						hasNextPage: true,
					});

					// second page item
					mockOnePageOfItemsWithPermissions({
						items: [
							{
								ari: alternateAri,
								fieldKey: 'description',
								fieldValue: 'A whole new world',
								isEditable: false,
							},
						],
						integrationKey: 'acme',
						hasNextPage: false,
					});

					renderTable();
					await screen.findByRole('cell', { name: 'Hello world' });

					scrollToBottom();

					await waitFor(() => {
						expect(fetchMock.calls(ORS_ACTIONS_DISCOVERY_ENDPOINT)).toHaveLength(2);
					});
					expect(actionsStore.storeState.getState()).toStrictEqual({
						actionsByIntegration: {
							acme: {
								summary: {
									actionKey: mockActionKey('summary'),
									type: 'string',
								},
								description: {
									actionKey: mockActionKey('description'),
									type: 'string',
								},
							},
						},
						permissions: {
							[ari]: {
								summary: {
									isEditable: true,
								},
							},
						},
					});
				});
			});
		});

		ffTest.off('platform-datasources-enable-two-way-sync', 'when jaws disabled', () => {
			it('cells should not be editable', async () => {
				mockOnePageOfItemsWithPermissions({
					items: [
						{
							ari,
							fieldKey: 'summary',
							fieldValue: 'Hello world',
							isEditable: true,
						},
					],
					integrationKey: 'acme',
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
