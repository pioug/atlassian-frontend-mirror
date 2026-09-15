import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl';
import { defaultRegistry } from 'react-sweet-state';

import { mockActionsDiscoveryEmptyResponse } from '@atlaskit/link-client-extension/use-data-source-client-extension/mockActionsDiscoveryEmptyResponse';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { MockIntersectionObserverFactory } from '@atlaskit/link-test-helpers';
import { ORS_ACTIONS_DISCOVERY_ENDPOINT } from '@atlaskit/link-test-helpers/datasource';
import type { AtomicActionInterface } from '@atlaskit/linking-types/datasource-actions';
import type {
	DatasourceDataResponseItem,
	DatasourceDataSchema,
} from '@atlaskit/linking-types/datasource';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { DatasourceExperienceIdProvider } from '../../contexts/datasource-experience-id/datasource-experience-id-provider';
import { ActionsStore } from '../../state/actions';
import * as localeMessages from '../../common/utils/locale/fetch-messages-for-locale';
import { loadingErrorMessages, missingColumnsMessages } from '../common/error-state/messages';

import {
	mockActionKey,
	mockActionsDiscoveryEndpoint,
	mockFetchDatasourceDataEndpoint,
} from './__tests__/_utils';
import { DatasourceTableView } from './datasourceTableView';

jest.mock('@atlaskit/link-client-extension/use-data-source-client-extension', () => {
	const originalModule = jest.requireActual(
		'@atlaskit/link-client-extension/use-data-source-client-extension',
	);
	return {
		...jest.requireActual('@atlaskit/link-client-extension/use-data-source-client-extension'),
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
		hasNextPage?: boolean;
		integrationKey: string;
		items: ItemWithPermissionMock[];
	}) => {
		mockFetchDatasourceData(items, hasNextPage);
		mockActionsDiscovery(items, integrationKey);
	};

	const renderTable = (
		props: Partial<React.ComponentProps<typeof DatasourceTableView>> = {},
		locale = 'en',
	) => {
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
							<IntlProvider locale={locale}>{children}</IntlProvider>
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

	it('replaces a successful response with no columns with recovery instructions and no refresh action', async () => {
		passGate('platform_datasource_missing_columns_error');
		mockFetchDatasourceDataEndpoint({
			meta: {},
			data: {
				items: [{ ari: { data: ari }, id: { data: 'TEST-1' } }],
				schema: { properties: [] },
				totalCount: 1,
			},
		});
		renderTable({ visibleColumnKeys: ['unavailable-column'] });

		await screen.findByText("We can't display these columns");
		expect(screen.getByTestId('datasource--loading-error')).toHaveTextContent(
			"These columns aren't available: unavailable-column. Edit this table to select different columns.",
		);
		expect(screen.queryByTestId('datasource-table-view-skeleton')).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
	});

	it('loads translated messages for the unavailable-columns error', async () => {
		passGate('platform_datasource_missing_columns_error');
		const loader = jest.spyOn(localeMessages, 'fetchMessagesForLocale').mockResolvedValue({
			[missingColumnsMessages.missingColumnsTitle.id]: 'Colonnes indisponibles',
			[missingColumnsMessages.missingColumnsDescriptionWithNames.id]:
				'Colonnes indisponibles : {columns}. Modifiez les colonnes du tableau.',
		});
		try {
			mockFetchDatasourceDataEndpoint({
				meta: {},
				data: {
					items: [{ ari: { data: ari }, id: { data: 'TEST-1' } }],
					schema: { properties: [] },
					totalCount: 1,
				},
			});
			renderTable({ visibleColumnKeys: ['column-one', 'column-two'] }, 'fr');

			await screen.findByText('Colonnes indisponibles');
			expect(loader).toHaveBeenCalledWith('fr');
			expect(screen.getByTestId('datasource--loading-error')).toHaveTextContent(
				'Colonnes indisponibles : column-one et column-two. Modifiez les colonnes du tableau.',
			);
		} finally {
			loader.mockRestore();
		}
	});

	it('loads translated messages and preserves refresh for network errors', async () => {
		passGate('platform_datasource_missing_columns_error');
		const loader = jest.spyOn(localeMessages, 'fetchMessagesForLocale').mockResolvedValue({
			[loadingErrorMessages.unableToLoadResults.id]: 'Chargement impossible',
			[loadingErrorMessages.checkConnection.id]: 'Vérifiez votre connexion.',
			[loadingErrorMessages.refresh.id]: 'Actualiser',
		});
		try {
			fetchMock.post('/gateway/api/object-resolver/datasource/datasource/fetch/data', 500);
			renderTable({}, 'fr');

			await screen.findByText('Chargement impossible');
			expect(screen.getByText('Vérifiez votre connexion.')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Actualiser' })).toBeEnabled();
			expect(loader).toHaveBeenCalledWith('fr');
		} finally {
			loader.mockRestore();
		}
	});

	describe('when jaws enabled', () => {
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
				window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);
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
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<DatasourceTableView
				datasourceId="datasource"
				parameters={{
					cloudId: 'some-cloud-id',
					jql: 'some-jql-query',
				}}
				visibleColumnKeys={['summary']}
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
		await expect(container).toBeAccessible();
	});
});
