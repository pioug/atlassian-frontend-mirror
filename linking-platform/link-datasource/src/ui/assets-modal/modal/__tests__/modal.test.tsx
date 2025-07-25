import { fireEvent, waitFor } from '@testing-library/react';

import { EVENT_CHANNEL } from '../../../../analytics';
import { FetchError, PermissionError } from '../../../../services/cmdbService.utils';

import {
	getAssetsClientErrorHookState,
	getAssetsClientLoadingHookState,
	getDefaultDataSourceTableHookState,
	getDefaultParameters,
	getEmptyDatasourceTableHookState,
	getErrorDatasourceTableHookState,
	getLoadingDatasourceTableHookState,
	getSingleAssetHookState,
	setup,
} from './_utils';

describe('AssetsConfigModal', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should call onCancel when cancel button is clicked', async () => {
		const { findByRole, onCancel } = await setup();
		(await findByRole('button', { name: 'Cancel' })).click();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('should show loading skeletons and disable insert button when fetching workspace and initial data', async () => {
		const { getByRole, getByTestId } = await setup({
			parameters: undefined,
			assetsClientHookState: getAssetsClientLoadingHookState(),
		});
		expect(getByTestId('assets-datasource-modal--search-container-skeleton')).toBeInTheDocument();
		expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
	});

	it('should show "access-required" and disable insert button when workspace fetch fails with PermissionError', async () => {
		const mockError = new PermissionError('workspace error');
		const { getByTestId, getByRole } = await setup({
			parameters: undefined,
			assetsClientHookState: getAssetsClientErrorHookState({
				workspaceError: mockError,
			}),
		});
		expect(getByTestId('datasource--access-required')).toBeInTheDocument();
		expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
	});

	it('should show "modal-loading-error" and disable insert button when workspace fetch fails with FetchError', async () => {
		const mockError = new FetchError(500, 'workspace error');
		const { getByTestId, getByRole } = await setup({
			parameters: undefined,
			assetsClientHookState: getAssetsClientErrorHookState({
				workspaceError: mockError,
			}),
		});
		expect(getByTestId('datasource-modal--loading-error')).toBeInTheDocument();
		expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
	});

	it('should show "access-required" and disable insert button when object schemas fetch fails with PermissionError', async () => {
		const mockError = new PermissionError('object schemas error');
		const { getByTestId, getByRole } = await setup({
			parameters: undefined,
			assetsClientHookState: getAssetsClientErrorHookState({
				objectSchemasError: mockError,
			}),
		});
		expect(getByTestId('datasource--access-required')).toBeInTheDocument();
		expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
	});

	it('should show "initial-state" when object schemas fetch fails with FetchError', async () => {
		const mockError = new FetchError(500, 'object schemas error');
		const { queryByTestId } = await setup({
			datasourceTableHookState: getEmptyDatasourceTableHookState(),
			parameters: undefined,
			assetsClientHookState: getAssetsClientErrorHookState({
				objectSchemasError: mockError,
			}),
		});
		await waitFor(() => {
			expect(queryByTestId('assets-aql-datasource-modal--initial-state-view')).toBeTruthy();
		});
	});

	it('should show "access-required" and disable insert button when existing object schema fetch fails with PermissionError', async () => {
		const mockError = new PermissionError('object schemas error');
		const { getByTestId, getByRole } = await setup({
			parameters: undefined,
			assetsClientHookState: getAssetsClientErrorHookState({
				existingObjectSchemaError: mockError,
			}),
		});
		expect(getByTestId('datasource--access-required')).toBeInTheDocument();
		expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
	});

	it('should show "initial-state" when existing object schema fetch fails with FetchError', async () => {
		const mockError = new FetchError(500, 'object schema error');
		const { queryByTestId } = await setup({
			datasourceTableHookState: getEmptyDatasourceTableHookState(),
			parameters: undefined,
			assetsClientHookState: getAssetsClientErrorHookState({
				existingObjectSchemaError: mockError,
			}),
		});
		await waitFor(() => {
			expect(queryByTestId('assets-aql-datasource-modal--initial-state-view')).toBeTruthy();
		});
	});

	it('should fire screen viewed analytics event when config modal is shown', async () => {
		const { onAnalyticFireEvent } = await setup();
		await waitFor(() => {
			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						eventType: 'screen',
						name: 'datasourceModalDialog',
						action: 'viewed',
						attributes: {},
					},
					context: [
						{
							component: 'datasourceConfigModal',
							source: 'datasourceConfigModal',
							attributes: { dataProvider: 'jsm-assets' },
						},
					],
				},
				EVENT_CHANNEL,
			);
		});
	});

	describe('when there is no parameters yet', () => {
		it('should display initial state', async () => {
			const { queryByTestId } = await setup({
				datasourceTableHookState: getEmptyDatasourceTableHookState(),
				parameters: undefined,
			});
			await waitFor(() => {
				expect(queryByTestId('assets-aql-datasource-modal--initial-state-view')).toBeTruthy();
			});
		});

		it('should disable insert button', async () => {
			const { getByRole } = await setup({
				visibleColumnKeys: undefined,
				datasourceTableHookState: getEmptyDatasourceTableHookState(),
				parameters: undefined,
			});
			await waitFor(() => {
				expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
			});
		});
	});

	describe('when datasource table status is `loading` and parameters provided', () => {
		it('should disable insert button', async () => {
			const { getByRole } = await setup({
				visibleColumnKeys: undefined,
				datasourceTableHookState: getLoadingDatasourceTableHookState(),
			});
			await waitFor(() => {
				expect(getByRole('button', { name: 'Update table' })).toBeDisabled();
			});
		});
	});

	describe('when isDisabled is false', () => {
		describe('and user clicks insert button', () => {
			it('should insert inlineCard adf when 1 asset is returned and valid url is available', async () => {
				const datasourceTableHookState = getSingleAssetHookState();
				const { getByRole, onInsert } = await setup({
					datasourceTableHookState,
				});
				const insertButton = getByRole('button', { name: 'Update table' });

				await waitFor(() => {
					expect(insertButton).toBeEnabled();
					insertButton.click();

					expect(onInsert).toHaveBeenCalledWith(
						{
							type: 'inlineCard',
							attrs: {
								url: 'hello.com',
							},
						},
						expect.any(Object),
					);
				});
			});
			it('should insert blockCard adf when no valid url is available', async () => {
				const datasourceTableHookState = getSingleAssetHookState();
				datasourceTableHookState.responseItems = [
					{
						key: {
							data: '',
						},
					},
				];
				const { getByRole, onInsert } = await setup({
					datasourceTableHookState,
				});
				const insertButton = getByRole('button', { name: 'Update table' });
				await waitFor(() => {
					expect(insertButton).toBeEnabled();
					insertButton.click();

					expect(onInsert).toHaveBeenCalledWith(
						expect.objectContaining({
							type: 'blockCard',
						}),
						expect.any(Object),
					);
				});
			});
			it('should insert blockCard adf when response does not have a "key" prop', async () => {
				const datasourceTableHookState = getSingleAssetHookState();
				datasourceTableHookState.responseItems = [{}];
				const { getByRole, onInsert } = await setup({
					datasourceTableHookState,
				});
				await waitFor(() => {
					const insertButton = getByRole('button', { name: 'Update table' });

					expect(insertButton).toBeEnabled();
					insertButton.click();

					expect(onInsert).toHaveBeenCalledWith(
						expect.objectContaining({
							type: 'blockCard',
						}),
						expect.any(Object),
					);
				});
			});
			it('should insert blockCard adf when more than 1 asset is returned and version not in initial parameters', async () => {
				const { getByRole, onInsert } = await setup({});
				const insertButton = getByRole('button', { name: 'Update table' });
				await waitFor(() => {
					expect(insertButton).toBeEnabled();
					insertButton.click();
					expect(onInsert).toHaveBeenCalledWith(
						{
							type: 'blockCard',
							attrs: {
								datasource: {
									id: 'some-assets-datasource-id',
									parameters: {
										workspaceId: 'some-workspace-id',
										aql: 'some-query',
										schemaId: '123',
										version: '2',
									},
									views: [
										{
											type: 'table',
											properties: {
												columns: [
													{
														key: 'myDefaultColumn',
													},
													{
														key: 'otherDefaultColumn',
													},
												],
											},
										},
									],
								},
							},
						},
						expect.any(Object),
					);
				});
			});
			it('should insert initial columns if version is set in initial parameters', async () => {
				const { getByRole, onInsert } = await setup({
					parameters: {
						workspaceId: 'some-workspace-id',
						aql: 'some-query',
						schemaId: '123',
						version: '2',
					},
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
					},
				});
				const insertButton = getByRole('button', { name: 'Update table' });
				await waitFor(() => {
					expect(insertButton).toBeEnabled();
					insertButton.click();

					expect(onInsert).toHaveBeenCalledWith(
						{
							type: 'blockCard',
							attrs: {
								datasource: {
									id: 'some-assets-datasource-id',
									parameters: {
										workspaceId: 'some-workspace-id',
										aql: 'some-query',
										schemaId: '123',
										version: '2',
									},
									views: [
										{
											type: 'table',
											properties: {
												columns: [
													{
														key: 'myColumn',
													},
												],
											},
										},
									],
								},
							},
						},
						expect.any(Object),
					);
				});
			});
			it('should insert blockCard adf with default column keys when visibleColumnKeys is undefined', async () => {
				const { getByRole, onInsert } = await setup({
					visibleColumnKeys: undefined,
				});
				const insertButton = getByRole('button', { name: 'Update table' });
				await waitFor(() => {
					expect(insertButton).toBeEnabled();
					insertButton.click();

					expect(onInsert).toHaveBeenCalledWith(
						{
							type: 'blockCard',
							attrs: {
								datasource: {
									id: 'some-assets-datasource-id',
									parameters: {
										workspaceId: 'some-workspace-id',
										aql: 'some-query',
										schemaId: '123',
										version: '2',
									},
									views: [
										{
											type: 'table',
											properties: {
												columns: [
													{
														key: 'myDefaultColumn',
													},
													{
														key: 'otherDefaultColumn',
													},
												],
											},
										},
									],
								},
							},
						},
						expect.any(Object),
					);
				});
			});
			it('should insert initial columns if no response items are returned and version is not set in initial parameters', async () => {
				const { getByRole, onInsert } = await setup({
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						responseItems: [],
					},
				});
				const insertButton = getByRole('button', { name: 'Update table' });
				await waitFor(() => {
					expect(insertButton).toBeEnabled();
					insertButton.click();

					expect(onInsert).toHaveBeenCalledWith(
						{
							type: 'blockCard',
							attrs: {
								datasource: {
									id: 'some-assets-datasource-id',
									parameters: {
										workspaceId: 'some-workspace-id',
										aql: 'some-query',
										schemaId: '123',
										version: '2',
									},
									views: [
										{
											type: 'table',
											properties: {
												columns: [
													{
														key: 'myDefaultColumn',
													},
													{
														key: 'otherDefaultColumn',
													},
												],
											},
										},
									],
								},
							},
						},
						expect.any(Object),
					);
				});
			});
			it("should show insert button with 'Insert object' text when only one asset is returned", async () => {
				const datasourceTableHookState = getSingleAssetHookState();
				const { getByRole } = await setup({
					parameters: undefined,
					datasourceTableHookState,
				});
				const insertButton = getByRole('button', {
					name: 'Insert object',
				});
				await waitFor(() => {
					expect(insertButton).toBeInTheDocument();
				});
			});

			it("should show insert button with 'Insert objects' text when more than one asset is returned", async () => {
				const datasourceTableHookState = getDefaultDataSourceTableHookState();
				const { getByRole } = await setup({
					parameters: undefined,
					datasourceTableHookState,
				});
				const insertButton = getByRole('button', {
					name: 'Insert objects',
				});
				await waitFor(() => {
					expect(insertButton).toBeInTheDocument();
				});
			});

			it("should show insert button with 'Update table' text when editing existing table", async () => {
				const { getByRole } = await setup();
				const insertButton = getByRole('button', {
					name: 'Update table',
				});
				await waitFor(() => {
					expect(insertButton).toBeInTheDocument();
					expect(insertButton).toBeEnabled();
				});
			});
		});

		describe('when no assets are returned', () => {
			it('should show no results screen in assets view mode', async () => {
				const { getByRole, getByText } = await setup({
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						responseItems: [],
					},
				});
				await waitFor(() => {
					expect(getByText("We couldn't find anything matching your search")).toBeInTheDocument();
					expect(getByRole('button', { name: 'Update table' })).toBeEnabled();
				});
			});
		});

		describe('when an er  ror occurs on data request', () => {
			it('should show network error message', async () => {
				const { getByTestId, getByText } = await setup({
					parameters: undefined,
					datasourceTableHookState: getErrorDatasourceTableHookState(),
				});
				await waitFor(() => {
					expect(getByText('We ran into an issue trying to fetch results')).toBeInTheDocument();
					expect(getByTestId('assets-datasource-modal--insert-button').textContent).toEqual(
						'Insert objects',
					);
				});
			});
			it("should call 'reset' on search button click", async () => {
				const mockReset = jest.fn();
				const { getByTestId } = await setup({
					datasourceTableHookState: {
						...getErrorDatasourceTableHookState(),
						reset: mockReset,
					},
				});
				const searchButton = await getByTestId('assets-datasource-modal--aql-search-button');
				await waitFor(() => {
					expect(searchButton).toBeEnabled();
				});
				await searchButton.click();
				await waitFor(() => {
					expect(mockReset).toHaveBeenCalledTimes(1);
					expect(mockReset).toHaveBeenCalledWith({
						shouldResetColumns: true,
						shouldForceRequest: true,
					});
				});
			});
		});

		describe('when handling column resetting in search query', () => {
			it('should reset columns when search has changed', async () => {
				const mockReset = jest.fn();

				const { getByTestId } = await setup({
					parameters: {
						...getDefaultParameters(),
						aql: 'name like a',
					},
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						reset: mockReset,
					},
				});

				// Change the AQL query to something else
				const textInput = getByTestId('assets-datasource-modal--aql-search-input');
				fireEvent.focus(textInput);
				fireEvent.change(textInput, {
					target: { value: 'objectType = "test aql query"' },
				});

				// Click on search button once the query is valid and button is enabled
				const searchButton = await getByTestId('assets-datasource-modal--aql-search-button');
				await waitFor(() => {
					expect(searchButton).toBeEnabled();
				});
				await searchButton.click();

				// Reset of columns should be applied because query has changed
				await waitFor(() => {
					expect(mockReset).toHaveBeenCalledTimes(1);
					expect(mockReset).toHaveBeenCalledWith({
						shouldResetColumns: true,
						shouldForceRequest: true,
					});
				});
			});

			it('should not reset columns when search is the same', async () => {
				const mockReset = jest.fn();

				const { getByTestId } = await setup({
					parameters: {
						...getDefaultParameters(),
						aql: 'name like a',
					},
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						reset: mockReset,
					},
				});

				// Change the AQL query to something else
				const textInput = getByTestId('assets-datasource-modal--aql-search-input');
				fireEvent.focus(textInput);
				fireEvent.change(textInput, {
					target: { value: 'name like a' },
				});

				// Click on search button
				const searchButton = await getByTestId('assets-datasource-modal--aql-search-button');
				await waitFor(() => {
					expect(searchButton).toBeEnabled();
				});
				await searchButton.click();

				// Reset of columns should not be applied because query is the same.
				await waitFor(() => {
					expect(mockReset).toHaveBeenCalledTimes(0);
				});
			});
		});
	});

	it('should capture and report a11y violations', async () => {
		const { component } = await setup();

		await expect(component.container).toBeAccessible();
	});
});
