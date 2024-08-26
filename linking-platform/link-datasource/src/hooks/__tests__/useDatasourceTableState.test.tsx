import React from 'react';

import { act, renderHook, type RenderHookOptions } from '@testing-library/react-hooks';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
	DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
	mockDatasourceDataResponse,
	mockDatasourceDataResponseWithSchema,
	mockDatasourceDetailsResponse,
	useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../analytics';
import { Store } from '../../state';
import {
	type DatasourceTableStateProps,
	useDatasourceTableState,
} from '../useDatasourceTableState';

const mockDatasourceId: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';
const mockParameterValue: string = 'project=EDM';
const mockCloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';
const onAnalyticFireEvent = jest.fn();

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
	<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
		<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
	</AnalyticsListener>
);

jest.mock('@atlaskit/link-client-extension', () => {
	const originalModule = jest.requireActual('@atlaskit/link-client-extension');
	return {
		...originalModule,
		useDatasourceClientExtension: jest.fn(),
	};
});

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/linking-common/sentry');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

describe('useDatasourceTableState', () => {
	let getDatasourceDetails: jest.Mock = jest.fn();
	let getDatasourceData: jest.Mock = jest.fn();
	const store = defaultRegistry.getStore(Store);

	const setup = (fields?: string[]) => {
		asMock(useDatasourceClientExtension).mockReturnValue({
			getDatasourceDetails,
			getDatasourceData,
		});

		const { result, waitForNextUpdate, rerender } = renderHook(
			({ fieldKeys, parameters, datasourceId }: Partial<DatasourceTableStateProps> = {}) =>
				useDatasourceTableState({
					datasourceId: datasourceId || mockDatasourceId,
					parameters: parameters || {
						cloudId: mockCloudId,
						jql: mockParameterValue,
					},
					fieldKeys: fieldKeys || fields,
				}),
			{ wrapper },
		);

		return {
			result,
			waitForNextUpdate,
			rerender,
		};
	};

	beforeEach(() => {
		jest.resetModules();
		store.storeState.resetState();
		getDatasourceDetails = jest.fn().mockResolvedValue(mockDatasourceDetailsResponse);
		getDatasourceData = jest.fn().mockResolvedValue(mockDatasourceDataResponse);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	ffTest('enable_datasource_react_sweet_state', () => {
		describe('without parameters', () => {
			const emptyParamsSetup = () => {
				asMock(useDatasourceClientExtension).mockReturnValue({
					getDatasourceDetails,
					getDatasourceData,
				});

				const { waitForNextUpdate, result } = renderHook(
					() => useDatasourceTableState({ datasourceId: mockDatasourceId }),
					{ wrapper },
				);

				return { result, waitForNextUpdate };
			};

			it('should return initial state', () => {
				const { result } = emptyParamsSetup();
				expect({
					...result.current,
				}).toEqual({
					status: 'empty',
					onNextPage: expect.any(Function),
					loadDatasourceDetails: expect.any(Function),
					responseItemIds: [],
					responseItems: [],
					reset: expect.any(Function),
					hasNextPage: true,
					columns: [],
					defaultVisibleColumnKeys: [],
					destinationObjectTypes: [],
					authDetails: [],
					extensionKey: undefined,
				});
			});

			it('should not call getDatasourceData', async () => {
				emptyParamsSetup();
				await flushPromises();
				expect(getDatasourceData).not.toHaveBeenCalled();
			});
		});
		describe('on mount', () => {
			it('should return initial state', async () => {
				const { result, waitForNextUpdate } = setup();
				expect({
					...result.current,
				}).toEqual({
					status: 'loading',
					providerName: undefined,
					onNextPage: expect.any(Function),
					loadDatasourceDetails: expect.any(Function),
					responseItemIds: [],
					responseItems: [],
					reset: expect.any(Function),
					hasNextPage: true,
					columns: [],
					defaultVisibleColumnKeys: [],
					totalCount: undefined,
					destinationObjectTypes: [],
					authDetails: [],
					extensionKey: undefined,
				});
				await waitForNextUpdate();
			});

			describe('calls #getDatasourceData and conditionally saves the entity data into the store based on enable_datasource_react_sweet_state feature flag value', () => {
				ffTest(
					'enable_datasource_react_sweet_state',
					async () => {
						const { waitForNextUpdate } = setup(['name', 'abcd', 'city']);
						expect(store.storeState.getState().items).toEqual({});

						expect(getDatasourceData).toHaveBeenCalledWith(
							mockDatasourceId,
							{
								parameters: {
									cloudId: mockCloudId,
									jql: mockParameterValue,
								},
								pageSize: 20,
								pageCursor: undefined,
								fields: ['name', 'abcd', 'city'],
								includeSchema: true,
							},
							false,
						);
						await waitForNextUpdate();
						const entries = Object.entries(store.storeState.getState().items);

						expect(entries).toHaveLength(4);
						entries.forEach(([ari, item]) => {
							const ariRegex = new RegExp(
								'ari:cloud:jira:3ac63b37-9bca-435e-9840-eff6f8739dba:issue/[0-9]+',
							);
							expect(ari).toEqual(expect.stringMatching(ariRegex));
							expect(item).toMatchObject({
								data: {
									ari: {
										data: expect.any(String),
									},
									id: { data: expect.any(String) },
									description: { data: expect.any(String) },
									createdAt: { data: expect.any(String) },
									assigned: {
										data: { displayName: expect.any(String) },
									},
									status: {
										data: {
											text: expect.any(String),
										},
									},
								},
								integrationKey: 'jira',
							});
						});
					},
					async () => {
						const { waitForNextUpdate } = setup(['name', 'abcd', 'city']);
						expect(store.storeState.getState().items).toEqual({});

						expect(getDatasourceData).toHaveBeenCalledWith(
							mockDatasourceId,
							{
								parameters: {
									cloudId: mockCloudId,
									jql: mockParameterValue,
								},
								pageSize: 20,
								pageCursor: undefined,
								fields: ['name', 'abcd', 'city'],
								includeSchema: true,
							},
							false,
						);
						await waitForNextUpdate();
						expect(store.storeState.getState().items).toEqual({});
					},
				);
			});

			it('should populate columns and defaultVisibleColumnKeys after getDatasourceData call with response items', async () => {
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				const expectedProperties = mockDatasourceDataResponseWithSchema?.data.schema?.properties;
				const expectedDefaultProperties = expectedProperties?.map((prop) => prop.key);

				expect(result.current.columns).toEqual(expectedProperties);
				expect(result.current.defaultVisibleColumnKeys).toEqual(expectedDefaultProperties);
			});

			it('should update columns on subsequent getDatasourceData call with new response schema', async () => {
				const expectedProperties = [
					{
						key: 'id',
						title: 'id',
						type: 'string',
					},
					{
						key: 'issue',
						title: 'Key',
						type: 'link',
					},
					{
						key: 'type',
						type: 'icon',
						title: 'Type',
					},
					{
						key: 'summary',
						title: 'Summary',
						type: 'link',
					},
				];
				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponseWithSchema,
					data: {
						...mockDatasourceDataResponseWithSchema.data,
						schema: {
							properties: expectedProperties.slice(-1),
						},
					},
				});

				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponseWithSchema,
					data: {
						...mockDatasourceDataResponseWithSchema.data,
						schema: {
							properties: expectedProperties,
						},
					},
				});

				await act(async () => {
					result.current.onNextPage();
				});

				const expectedDefaultProperties = expectedProperties.map((prop) => prop.key);

				expect(result.current.columns).toEqual(expectedProperties);
				expect(result.current.defaultVisibleColumnKeys).toEqual(expectedDefaultProperties);
			});

			it('should populate extensionKey with the value received in meta after getDatasourceData call', async () => {
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				const expectedExtensionKey = mockDatasourceDataResponseWithSchema.meta.extensionKey;
				expect(result.current.extensionKey).toEqual(expectedExtensionKey);
			});

			it('should populate providerName with the value received in meta after getDatasourceData call', async () => {
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				const expectedProviderName = mockDatasourceDataResponseWithSchema.meta.providerName;
				expect(result.current.providerName).toEqual(expectedProviderName);
			});

			it('should populate destinationObjectTypes with the value received in meta after getDatasourceData call', async () => {
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				const expectedDestinationObjectTypes =
					mockDatasourceDataResponseWithSchema.meta.destinationObjectTypes;
				expect(result.current.destinationObjectTypes).toEqual(expectedDestinationObjectTypes);
			});

			it('should not populate columns after getDatasourceData call with no response items', async () => {
				asMock(getDatasourceData).mockResolvedValue({
					...mockDatasourceDataResponseWithSchema,
					data: { ...mockDatasourceDataResponseWithSchema.data, items: [] },
				});
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				expect(result.current.columns.length).toEqual(0);
				expect(result.current.defaultVisibleColumnKeys.length).toEqual(0);
			});

			it('should change status to "resolved" when getDatasourceData call is complete', async () => {
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(result.current.status).toBe('resolved');
			});

			it('should change status to "rejected" on request error', async () => {
				asMock(getDatasourceData).mockRejectedValueOnce(new Error('error'));
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(result.current.status).toBe('rejected');
			});

			it('should change status to "unauthorized" on request auth error', async () => {
				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponse,
					meta: { ...mockDatasourceDataResponse.meta, access: 'unauthorized' },
				});
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(result.current.status).toBe('unauthorized');
			});

			it('should change status to "forbidden" on request auth error', async () => {
				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponse,
					meta: { ...mockDatasourceDataResponse.meta, access: 'forbidden' },
				});
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(result.current.status).toBe('forbidden');
			});

			it.each([
				['unauthorized', 401],
				['forbidden', 403],
				['rejected', 500],
			])(
				'should change status to "%s" on request error %s response',
				async (status: string, errorStatusCode: number) => {
					// Needed to create instanceof
					const errorResponse: Response = Object.create(Response.prototype);
					asMock(getDatasourceData).mockRejectedValueOnce(
						Object.assign(errorResponse, { status: errorStatusCode }),
					);
					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					expect(result.current.status).toBe(status);
				},
			);

			it('should populate responseItems with data coming from getDatasourceData', async () => {
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(result.current.responseItems).toEqual(mockDatasourceDataResponse.data.items);

				expect(result.current.totalCount).toEqual(1234);
			});

			it('should populate hasNextPage', async () => {
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(result.current.hasNextPage).toBe(true);
			});

			it('should not fire analytics event "ui.nextItem.loaded" on initial load', async () => {
				const { waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(onAnalyticFireEvent).not.toHaveBeenCalled();
			});
		});

		describe('#onNextPage()', () => {
			describe('when called after mount', () => {
				it('should call getDatasourceData with pageCursor from previous call', async () => {
					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					act(() => {
						result.current.onNextPage();
					});
					await waitForNextUpdate();

					expect(getDatasourceData).toHaveBeenCalledWith(
						mockDatasourceId,
						{
							parameters: {
								cloudId: mockCloudId,
								jql: mockParameterValue,
							},
							pageSize: 20,
							pageCursor: undefined,
							fields: [],
							includeSchema: true,
						},
						false,
					);

					act(() => {
						result.current.onNextPage();
					});

					await waitForNextUpdate();

					expect(getDatasourceData).toHaveBeenCalledWith(
						mockDatasourceId,
						{
							parameters: {
								cloudId: mockCloudId,
								jql: mockParameterValue,
							},
							pageSize: 20,
							pageCursor: mockDatasourceDataResponse.data.nextPageCursor,
							fields: [],
							includeSchema: true,
						},
						false,
					);
				});

				it('should populate responseItems with new data coming from getDatasourceData and not add duplicate data', async () => {
					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					expect(result.current.responseItems).toEqual(mockDatasourceDataResponse.data.items);

					// adding new data to response
					const newData = {
						...mockDatasourceDataResponseWithSchema,
						data: {
							totalCount: '1234',
							items: [
								{
									id: { data: 'EDM-17' },
									description: { data: 'Be a cool guy' },
									createdAt: { data: '2023-05-08T01:30:00.000-08:00' },
									assigned: {
										data: {
											displayName: 'Hana',
										},
									},
									status: {
										data: {
											text: 'Done',
											style: {
												appearance: 'success',
											},
										},
									},
								},
							],
						},
					};

					asMock(getDatasourceData).mockResolvedValueOnce(newData);

					act(() => {
						result.current.onNextPage();
					});

					await waitForNextUpdate();

					expect(result.current.responseItems).toStrictEqual([
						...mockDatasourceDataResponse.data.items,
						...newData.data.items,
					]);
				});

				it('should not call getDatasourceData when requesting already retrieved column', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const { waitForNextUpdate, rerender } = setup();

					await waitForNextUpdate();

					rerender({
						fieldKeys: ['issue'],
					});

					expect(getDatasourceData).toHaveBeenCalledTimes(1);
				});

				it('should call getDatasourceData a second time when requesting a new column without existing data', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const { rerender, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					rerender({
						fieldKeys: ['issued'],
					});

					await waitForNextUpdate();

					expect(getDatasourceData).toHaveBeenCalledTimes(2);
				});

				it('should not call getDatasourceData a second time when requesting a new column with existing data', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const { rerender, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					rerender({
						fieldKeys: ['due'],
					});

					expect(getDatasourceData).toHaveBeenCalledTimes(1);
				});

				it('should overwrite exiting columns when requesting first page info', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					const expectedProperties = mockDatasourceDataResponseWithSchema?.data.schema?.properties;
					expect(result.current.columns).toEqual(expectedProperties);

					act(() => {
						result.current.onNextPage({
							shouldRequestFirstPage: true,
						});
					});

					await waitForNextUpdate();

					expect(result.current.columns).toEqual(expectedProperties);
				});

				it('should not request schema when fullschema is present', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const requestedFields = ['type', 'summary'];
					const { result, rerender, waitForNextUpdate } = setup(requestedFields);
					await waitForNextUpdate();

					expect(result.current.columns.map((column) => column.key)).toEqual(requestedFields);

					rerender({
						fieldKeys: ['assignee'],
					});

					await waitForNextUpdate();
					expect(getDatasourceData).toHaveBeenCalledTimes(2);

					expect(getDatasourceData).toHaveBeenNthCalledWith(
						1,
						mockDatasourceId,
						{
							parameters: expect.any(Object),
							pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
							pageCursor: undefined,
							fields: ['type', 'summary'],
							includeSchema: true,
						},
						false,
					);

					expect(getDatasourceData).toHaveBeenNthCalledWith(
						2,
						mockDatasourceId,
						{
							parameters: expect.any(Object),
							pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
							pageCursor: undefined,
							fields: ['assignee'],
							includeSchema: false,
						},
						false,
					);
				});

				it('should use fullschema when fullschema is present', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const requestedFields = ['type', 'summary'];
					const { result, rerender, waitForNextUpdate } = setup(requestedFields);
					await waitForNextUpdate();

					expect(result.current.columns.map((column) => column.key)).toEqual(requestedFields);

					rerender({
						fieldKeys: ['assignee'],
					});

					await waitForNextUpdate();

					expect(getDatasourceData).toHaveBeenCalledTimes(2);
					expect(getDatasourceData).toHaveBeenNthCalledWith(
						2,
						mockDatasourceId,
						{
							parameters: expect.any(Object),
							pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
							pageCursor: undefined,
							fields: ['assignee'],
							includeSchema: false,
						},
						false,
					);
					expect(result.current.columns.map((column) => column.key)).toEqual(['assignee']);
				});

				it('should use fieldKeys when fieldKeys are requested', async () => {
					const response = JSON.parse(JSON.stringify(mockDatasourceDataResponseWithSchema));
					if (response.data.schema) {
						response.data.schema.defaultProperties = ['issue', 'type', 'summary'];
					}
					asMock(getDatasourceData).mockResolvedValue(response);

					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					expect(result.current.columns.map((column) => column.key)).toEqual([
						'issue',
						'type',
						'summary',
					]);
				});

				it('should fire analytics event "ui.nextItem.loaded" when next page is loaded', async () => {
					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					act(() => {
						result.current.onNextPage();
					});

					await waitForNextUpdate();
					expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
						{
							payload: {
								action: 'loaded',
								actionSubject: 'nextItem',
								eventType: 'track',
								attributes: {
									extensionKey: 'jira-object-provider',
									destinationObjectTypes: ['issue'],
									loadedItemCount: 8,
								},
							},
						},
						EVENT_CHANNEL,
					);
				});

				it('should not call fire analytics event "ui.nextItem.loaded" when adding new column not found in data', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const { rerender, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					rerender({
						fieldKeys: ['issued'],
					});

					await waitForNextUpdate();
					// reset() happens before onNextPage() so isUserLoadingNextPage is false and event is not fired

					expect(onAnalyticFireEvent).toHaveBeenCalledTimes(0);
				});

				it('should not fire analytics event "ui.nextItem.loaded" when adding old column with data', async () => {
					asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
					const { rerender, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					rerender({
						fieldKeys: ['issue'],
					});

					expect(onAnalyticFireEvent).not.toHaveBeenCalled();
				});

				it('should update authDetails when the data request is unauthorized', async () => {
					asMock(getDatasourceData).mockResolvedValue({
						...mockDatasourceDataResponseWithSchema,
						meta: {
							access: 'unauthorized',
							providerName: 'Amplitude',
							auth: [
								{
									key: 'amplitude',
									displayName: 'Atlassian Links - Amplitude',
									url: 'https://id.atlassian.com/login',
								},
							],
						},
					});

					const { waitForNextUpdate, result } = setup();
					await waitForNextUpdate();

					expect(result.current.authDetails).toEqual([
						{
							key: 'amplitude',
							displayName: 'Atlassian Links - Amplitude',
							url: 'https://id.atlassian.com/login',
						},
					]);
				});

				it('should update providerName when the data request is unauthorized', async () => {
					asMock(getDatasourceData).mockResolvedValue({
						...mockDatasourceDataResponseWithSchema,
						meta: {
							access: 'unauthorized',
							providerName: 'Amplitude',
							auth: [
								{
									key: 'amplitude',
									displayName: 'Atlassian Links - Amplitude',
									url: 'https://id.atlassian.com/login',
								},
							],
						},
					});

					const { waitForNextUpdate, result } = setup();
					await waitForNextUpdate();

					expect(result.current.providerName).toEqual('Amplitude');
				});

				it('should not update providerName if the data request fails', async () => {
					asMock(getDatasourceData).mockRejectedValue(new Error('error'));

					const { waitForNextUpdate, result } = setup();
					await waitForNextUpdate();

					expect(result.current.providerName).toBeUndefined();
				});
			});

			describe('when called for the last time', () => {
				it('should populate hasNextPage', async () => {
					getDatasourceData = jest.fn().mockResolvedValue({
						...mockDatasourceDataResponse,
						data: {
							...mockDatasourceDataResponse.data,
							nextPageCursor: undefined,
						},
					});
					const { result, waitForNextUpdate } = setup();
					await waitForNextUpdate();

					act(() => {
						result.current.onNextPage();
					});
					await waitForNextUpdate();

					expect(result.current.hasNextPage).toBe(false);
				});
			});
		});

		describe('#loadDatasourceDetails', () => {
			it('should update only if new columns are available', async () => {
				asMock(getDatasourceDetails).mockResolvedValue({
					...mockDatasourceDetailsResponse,
					data: {
						schema: {
							properties: [
								{
									key: 'newcol',
									title: 'New Column',
									type: 'string',
								},
							],
						},
					},
				});
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				act(() => {
					result.current.loadDatasourceDetails();
				});
				await waitForNextUpdate();

				expect(result.current.columns).toEqual([
					...(mockDatasourceDataResponseWithSchema?.data.schema?.properties || []),
					{
						key: 'newcol',
						title: 'New Column',
						type: 'string',
					},
				]);
			});

			it('should not update when no new columns are available', async () => {
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				act(() => {
					result.current.loadDatasourceDetails();
				});

				expect(result.current.columns).toEqual(
					mockDatasourceDataResponseWithSchema?.data.schema?.properties,
				);
			});

			it('should update status to unauthorized on auth errors', async () => {
				asMock(getDatasourceData).mockResolvedValue({
					...mockDatasourceDataResponseWithSchema,
					meta: {
						...mockDatasourceDataResponseWithSchema.meta,
						access: 'unauthorized',
					},
				});
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				act(() => {
					result.current.loadDatasourceDetails();
				});
				await waitForNextUpdate();

				expect(result.current.status).toEqual('unauthorized');
			});

			it('should always return extensionKey on auth errors', async () => {
				asMock(getDatasourceData).mockResolvedValue({
					...mockDatasourceDataResponseWithSchema,
					meta: {
						...mockDatasourceDataResponseWithSchema.meta,
						access: 'unauthorized',
					},
				});
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				act(() => {
					result.current.loadDatasourceDetails();
				});
				await waitForNextUpdate();

				expect(result.current.extensionKey).toEqual('jira-object-provider');
			});

			it('should update authDetails when the details request is unauthorized', async () => {
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);

				asMock(getDatasourceDetails).mockResolvedValue({
					...mockDatasourceDetailsResponse,
					meta: {
						access: 'unauthorized',
						providerName: 'Amplitude',
						auth: [
							{
								key: 'amplitude',
								displayName: 'Atlassian Links - Amplitude',
								url: 'https://id.atlassian.com/login',
							},
						],
					},
				});
				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				act(() => {
					result.current.loadDatasourceDetails();
				});
				await waitForNextUpdate();

				expect(result.current.authDetails).toEqual([
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'https://id.atlassian.com/login',
					},
				]);
			});

			it.each([
				['unauthorized', 401],
				['forbidden', 403],
				['rejected', 500],
			])(
				'should update status to "%s" on request error %s response',
				async (status: string, errorStatusCode: number) => {
					// Needed to create instanceof
					const errorResponse: Response = Object.create(Response.prototype);
					asMock(getDatasourceData).mockRejectedValueOnce(
						Object.assign(errorResponse, { status: errorStatusCode }),
					);
					const { waitForNextUpdate, result } = setup();
					await waitForNextUpdate();

					act(() => {
						result.current.loadDatasourceDetails();
					});
					await waitForNextUpdate();

					expect(result.current.status).toEqual(status);
				},
			);
		});

		describe('#reset()', () => {
			const customSetup = async () => {
				const { result, waitForNextUpdate, rerender } = setup();

				rerender({
					parameters: {},
				});

				await waitForNextUpdate();

				return { result, waitForNextUpdate, rerender };
			};

			it("should set status to 'empty' when reset() called", async () => {
				const { result } = await customSetup();

				act(() => {
					result.current.reset();
				});

				expect(result.current.status).toBe('empty');
			});

			it('should set response items to empty array [] when reset() called', async () => {
				const { result } = await customSetup();

				expect(result.current.responseItems).toEqual(mockDatasourceDataResponse.data.items);

				act(() => {
					result.current.reset();
				});

				expect(result.current.responseItems).toEqual([]);
			});

			it('should set hasNextPage to true when reset() called', async () => {
				getDatasourceData = jest.fn().mockResolvedValue({
					meta: mockDatasourceDataResponse.meta,
					data: {
						...mockDatasourceDataResponse.data,
						nextPageCursor: undefined,
					},
				});

				const { result, waitForNextUpdate, rerender } = setup();

				await waitForNextUpdate();

				expect(result.current.hasNextPage).toBe(false);

				rerender({
					parameters: {},
				});

				act(() => {
					result.current.reset();
				});

				expect(result.current.hasNextPage).toBe(true);
			});

			it('should set totalCount to undefined when reset() called', async () => {
				const { result } = await customSetup();

				expect(result.current.totalCount).toEqual(1234);

				act(() => {
					result.current.reset();
				});

				expect(result.current.totalCount).toBe(undefined);
			});

			it('should call onNextPage after reset() called', async () => {
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();
				expect(getDatasourceData).toHaveBeenCalledTimes(1);
				// Check third, shouldForceRequest argument to be false by default
				expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(false);

				asMock(getDatasourceData).mockReset();
				act(() => {
					result.current.reset();
				});
				await waitForNextUpdate();

				expect(getDatasourceData).toHaveBeenCalledTimes(1);
				// Check third, shouldForceRequest argument to be still false by default
				expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(false);
			});

			it('should use provided shouldForceRequest value when next time data requested', async () => {
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				asMock(getDatasourceData).mockReset();
				act(() => {
					result.current.reset({ shouldForceRequest: true });
				});
				expect(getDatasourceData).toHaveBeenCalledTimes(1);
				// Check third, shouldForceRequest argument to be true this time only;
				expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(true);

				asMock(getDatasourceData).mockReset();
				act(() => {
					result.current.reset();
				});
				await waitForNextUpdate();
				// Check third, shouldForceRequest argument to be back to false by default
				expect(asMock(getDatasourceData).mock.calls[0][2]).toBe(false);
			});

			it('should set nextCursor to undefined when reset() called', async () => {
				const { result, waitForNextUpdate, rerender } = setup();
				await waitForNextUpdate();

				act(() => {
					result.current.onNextPage();
				});
				await waitForNextUpdate();

				expect(getDatasourceData).toHaveBeenLastCalledWith(
					mockDatasourceId,
					expect.objectContaining({
						pageCursor: mockDatasourceDataResponse.data.nextPageCursor,
					}),
					false,
				);

				rerender({
					parameters: {},
				});

				act(() => {
					result.current.reset();
				});

				act(() => {
					result.current.onNextPage();
				});
				await waitForNextUpdate();

				expect(getDatasourceData).toHaveBeenLastCalledWith(
					mockDatasourceId,
					expect.objectContaining({
						pageCursor: undefined,
					}),
					false,
				);
			});

			it('should not fire analytics event "ui.nextItem.loaded" when reset() is called', async () => {
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();

				asMock(getDatasourceData).mockReset();
				asMock(getDatasourceData).mockResolvedValue(mockDatasourceDataResponseWithSchema);
				act(() => {
					result.current.reset();
				});
				await waitForNextUpdate();

				expect(result.current.status).toBe('resolved');
				expect(onAnalyticFireEvent).not.toHaveBeenCalled();
			});

			it('should reset authDetails when reset() is called', async () => {
				asMock(getDatasourceData).mockResolvedValue({
					...mockDatasourceDataResponseWithSchema,
					meta: {
						access: 'unauthorized',
						providerName: 'Amplitude',
						auth: [
							{
								key: 'amplitude',
								displayName: 'Atlassian Links - Amplitude',
								url: 'https://id.atlassian.com/login',
							},
						],
					},
				});

				const { waitForNextUpdate, result } = setup();
				await waitForNextUpdate();

				expect(result.current.authDetails).toEqual([
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'https://id.atlassian.com/login',
					},
				]);

				asMock(getDatasourceData).mockReset();

				act(() => {
					result.current.reset();
				});
				await waitForNextUpdate();

				expect(result.current.authDetails).toEqual([]);
			});
		});

		describe('error logging', () => {
			beforeEach(() => {
				asMock(getDatasourceData).mockReset();
				asMock(getDatasourceDetails).mockReset();
				asMock(captureException).mockReset();
			});

			describe('when getDatasourceData fails with an `Error`, it should log to Splunk and log to Sentry conditionally based on FF', () => {
				ffTest(
					'platform.linking-platform.datasources.enable-sentry-client',
					async () => {
						const mockError = new Error('Mock error');
						asMock(getDatasourceData).mockRejectedValueOnce(new Error('Mock error'));

						const { waitForNextUpdate } = setup();
						await waitForNextUpdate();

						expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
							{
								payload: {
									action: 'operationFailed',
									actionSubject: 'datasource',
									eventType: 'operational',
									attributes: {
										errorLocation: 'onNextPage',
										status: null,
										traceId: null,
									},
								},
							},
							EVENT_CHANNEL,
						);
						expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
							datasourceId: mockDatasourceId,
						});
					},
					async () => {
						const mockError = new Error('Mock error');
						asMock(getDatasourceData).mockRejectedValueOnce(mockError);

						const { waitForNextUpdate } = setup();
						await waitForNextUpdate();

						expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
							{
								payload: {
									action: 'operationFailed',
									actionSubject: 'datasource',
									eventType: 'operational',
									attributes: {
										errorLocation: 'onNextPage',
										status: null,
										traceId: null,
									},
								},
							},
							EVENT_CHANNEL,
						);
						expect(captureException).toHaveBeenCalledTimes(0);
					},
				);
			});

			it('when getDatasourceData fails with a `Response`, it should log to Splunk and log to Sentry conditionally based on FF', async () => {
				asMock(getDatasourceData).mockRejectedValueOnce(
					new Response('', {
						status: 500,
						headers: { 'x-trace-id': 'mocktraceid' },
					}),
				);

				const { waitForNextUpdate } = setup();
				await waitForNextUpdate();

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'operationFailed',
							actionSubject: 'datasource',
							eventType: 'operational',
							attributes: {
								errorLocation: 'onNextPage',
								status: 500,
								traceId: 'mocktraceid',
							},
						},
					},
					EVENT_CHANNEL,
				);
				expect(captureException).toHaveBeenCalledTimes(0);
			});

			describe('when `getDatasourceDetails` fails with an `Error`, it should log to Splunk and log to Sentry conditionally based on FF', () => {
				ffTest(
					'platform.linking-platform.datasources.enable-sentry-client',
					async () => {
						const mockError = new Error('Mock error');
						asMock(getDatasourceData).mockResolvedValueOnce({
							...mockDatasourceDataResponseWithSchema,
						});
						asMock(getDatasourceDetails).mockRejectedValueOnce(new Error('Mock error'));

						const { result, waitForNextUpdate } = setup();
						await waitForNextUpdate();
						act(() => {
							result.current.loadDatasourceDetails();
						});
						await waitForNextUpdate();

						expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
							{
								payload: {
									action: 'operationFailed',
									actionSubject: 'datasource',
									eventType: 'operational',
									attributes: {
										errorLocation: 'loadDatasourceDetails',
										status: null,
										traceId: null,
									},
								},
							},
							EVENT_CHANNEL,
						);
						expect(captureException).toHaveBeenCalledWith(mockError, 'link-datasource', {
							datasourceId: mockDatasourceId,
						});
					},
					async () => {
						const mockError = new Error('Mock error');
						asMock(getDatasourceData).mockResolvedValueOnce({
							...mockDatasourceDataResponseWithSchema,
						});
						asMock(getDatasourceDetails).mockRejectedValueOnce(mockError);

						const { result, waitForNextUpdate } = setup();
						await waitForNextUpdate();
						act(() => {
							result.current.loadDatasourceDetails();
						});
						await waitForNextUpdate();

						expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
							{
								payload: {
									action: 'operationFailed',
									actionSubject: 'datasource',
									eventType: 'operational',
									attributes: {
										errorLocation: 'loadDatasourceDetails',
										status: null,
										traceId: null,
									},
								},
							},
							EVENT_CHANNEL,
						);
						expect(captureException).toHaveBeenCalledTimes(0);
					},
				);
			});

			it('when `getDatasourceDetails` fails with a `Response`, it should log to Splunk only', async () => {
				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponseWithSchema,
				});
				asMock(getDatasourceDetails).mockRejectedValueOnce(
					new Response('', {
						status: 500,
						headers: { 'x-trace-id': 'mocktraceid' },
					}),
				);

				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();
				act(() => {
					result.current.loadDatasourceDetails();
				});
				await waitForNextUpdate();

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'operationFailed',
							actionSubject: 'datasource',
							eventType: 'operational',
							attributes: {
								errorLocation: 'loadDatasourceDetails',
								status: 500,
								traceId: 'mocktraceid',
							},
						},
					},
					EVENT_CHANNEL,
				);
				expect(captureException).toHaveBeenCalledTimes(0);
			});

			it('should not log an operational even or a sentry event when getDatasourceData succeeds', async () => {
				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponseWithSchema,
				});
				const { waitForNextUpdate } = setup();
				await waitForNextUpdate();
				expect(onAnalyticFireEvent).toHaveBeenCalledTimes(0);
				expect(captureException).toHaveBeenCalledTimes(0);
			});

			it('should not log an operational even or a sentry event when getDatasourceDetails succeeds', async () => {
				asMock(getDatasourceData).mockResolvedValueOnce({
					...mockDatasourceDataResponseWithSchema,
				});
				asMock(getDatasourceDetails).mockResolvedValueOnce({
					...mockDatasourceDetailsResponse,
					data: {
						schema: {
							properties: [
								{
									key: 'newcol',
									title: 'New Column',
									type: 'string',
								},
							],
						},
					},
				});
				const { result, waitForNextUpdate } = setup();
				await waitForNextUpdate();
				act(() => {
					result.current.loadDatasourceDetails();
				});
				await waitForNextUpdate();
				expect(onAnalyticFireEvent).toHaveBeenCalledTimes(0);
				expect(captureException).toHaveBeenCalledTimes(0);
			});
		});
	});
});
