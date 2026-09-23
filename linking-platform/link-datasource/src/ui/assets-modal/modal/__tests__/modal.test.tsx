import { act, fireEvent, waitFor } from '@testing-library/react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { EVENT_CHANNEL } from '../../../../analytics/constants';
import type { DatasourceTableState } from '../../../../hooks/useDatasourceTableState';
import { FetchError } from '../../../../services/FetchError';
import { PermissionError } from '../../../../services/PermissionError';
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

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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
			const setupWithNoAssets = () =>
				setup({
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						responseItems: [],
						responseItemIds: [],
						totalCount: 0,
					},
				});

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

			it('should replace the whole table with the no results screen when the feature gate is off', async () => {
				failGate('platform_lp_sllv_ux_improvements');
				const { queryByTestId } = await setupWithNoAssets();

				await waitFor(() => {
					expect(queryByTestId('datasource-modal--no-results')).toBeInTheDocument();
				});
				expect(queryByTestId('asset-datasource-table--head')).not.toBeInTheDocument();
			});

			it('should keep the table headers and show the no results screen in place of the rows when the feature gate is on', async () => {
				passGate('platform_lp_sllv_ux_improvements');
				const { getByTestId, getByText } = await setupWithNoAssets();

				await waitFor(() => {
					expect(getByText("We couldn't find anything matching your search")).toBeInTheDocument();
				});
				expect(getByTestId('asset-datasource-table--head')).toBeInTheDocument();
				expect(getByTestId('asset-datasource-table--no-results-row')).toBeInTheDocument();
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
			// The hook derives `columns` and `defaultVisibleColumnKeys` from the same schema properties,
			// so a fixture that lets them disagree describes a state production cannot reach. The
			// exception is the column picker, which widens `columns` alone.
			const reporting = ({
				columnKeys,
				defaultVisibleColumnKeys = columnKeys,
			}: {
				columnKeys: string[];
				defaultVisibleColumnKeys?: string[];
			}): DatasourceTableState => ({
				...getDefaultDataSourceTableHookState(),
				columns: columnKeys.map((key) => ({ key, title: key, type: 'string' as const })),
				defaultVisibleColumnKeys,
			});

			it('should reset columns when search has changed', async () => {
				failGate('platform_lp_sllv_preserve_assets_columns');
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

			const searchWithNewAqlAndInsert = async ({
				visibleColumnKeys,
				mockReset,
			}: {
				mockReset: jest.Mock;
				visibleColumnKeys: string[];
			}) => {
				const { onInsert, searchWithNewAql, clickSearchButton, findByRole } = await setup({
					parameters: {
						...getDefaultParameters(),
						aql: 'name like a',
						version: '2',
					},
					visibleColumnKeys,
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						reset: mockReset,
					},
				});

				searchWithNewAql('objectType = "test aql query"');
				await clickSearchButton();

				(await findByRole('button', { name: 'Update table' })).click();
				await waitFor(() => {
					expect(onInsert).toHaveBeenCalledTimes(1);
				});

				const [insertedAdf] = onInsert.mock.calls[0];
				return insertedAdf.attrs.datasource.views[0].properties.columns.map(
					({ key }: { key: string }) => key,
				);
			};

			it('should keep the selected columns for an aql-only change when the gate is on', async () => {
				passGate('platform_lp_sllv_preserve_assets_columns');
				const mockReset = jest.fn();

				const insertedColumnKeys = await searchWithNewAqlAndInsert({
					visibleColumnKeys: ['myColumn', 'otherColumn'],
					mockReset,
				});

				expect(mockReset).toHaveBeenCalledWith({
					shouldResetColumns: false,
					shouldForceRequest: true,
				});
				expect(insertedColumnKeys).toEqual(['myColumn', 'otherColumn']);
			});

			it('should fall back to the default columns for an aql-only change when the gate is off', async () => {
				failGate('platform_lp_sllv_preserve_assets_columns');
				const mockReset = jest.fn();

				const insertedColumnKeys = await searchWithNewAqlAndInsert({
					visibleColumnKeys: ['myColumn', 'otherColumn'],
					mockReset,
				});

				expect(mockReset).toHaveBeenCalledWith({
					shouldResetColumns: true,
					shouldForceRequest: true,
				});
				expect(insertedColumnKeys).toEqual(['myDefaultColumn', 'otherDefaultColumn']);
			});

			it('should not restore the columns of a previous object schema after an empty search', async () => {
				passGate('platform_lp_sllv_preserve_assets_columns');

				// What the macro was saved with, chosen against the original object schema
				const macroColumnKeys = ['myColumn', 'otherColumn'];
				const newSchemaColumnKeys = ['myDefaultColumn', 'otherDefaultColumn'];

				const resolvedWith = (columnKeys: string[]) => reporting({ columnKeys });
				const noResultsWith = (columnKeys: string[]) => ({
					...resolvedWith(columnKeys),
					responseItems: [],
					responseItemIds: [],
					totalCount: 0,
				});

				const {
					onInsert,
					selectNewSchema,
					searchWithNewAql,
					setDatasourceTableHookState,
					getByTestId,
					findByRole,
				} = await setup({
					parameters: { ...getDefaultParameters(), aql: 'name like a', version: '2' },
					visibleColumnKeys: macroColumnKeys,
					datasourceTableHookState: resolvedWith(macroColumnKeys),
				});

				const search = async (aql: string) => {
					searchWithNewAql(aql);
					const searchButton = getByTestId('assets-datasource-modal--aql-search-button');
					await waitFor(() => {
						expect(searchButton).toBeEnabled();
					});
					searchButton.click();
				};

				// Switching object schema drops the macro columns for the new schema's defaults
				setDatasourceTableHookState(resolvedWith(newSchemaColumnKeys));
				await selectNewSchema('schemaTwo');
				await search('objectType = "in the new schema"');

				// A search returning nothing does not re-report the schema's columns
				setDatasourceTableHookState(noResultsWith(newSchemaColumnKeys));
				await search('objectType = "with no results"');

				// The next search resolves and narrows the reported columns to the requested fields,
				// which is what makes defaultVisibleColumnKeys change again
				setDatasourceTableHookState(resolvedWith(['myDefaultColumn']));
				await search('objectType = "with results"');

				(await findByRole('button', { name: 'Update table' })).click();
				await waitFor(() => {
					expect(onInsert).toHaveBeenCalledTimes(1);
				});

				const [insertedAdf] = onInsert.mock.calls[0];
				const insertedColumnKeys = insertedAdf.attrs.datasource.views[0].properties.columns.map(
					({ key }: { key: string }) => key,
				);

				// Trimmed to what the last search still reported, and crucially not the macro columns
				expect(insertedColumnKeys).toEqual(['myDefaultColumn']);
				expect(insertedColumnKeys).not.toEqual(macroColumnKeys);
			});

			it('should adopt the reported defaults when there was no selection to preserve', async () => {
				passGate('platform_lp_sllv_preserve_assets_columns');
				const mockReset = jest.fn();

				const { onInsert, searchWithNewAql, setDatasourceTableHookState, getByTestId, findByRole } =
					await setup({
						parameters: { ...getDefaultParameters(), aql: 'name like a', version: '2' },
						// Nothing was ever selected, and the first response reported nothing either
						visibleColumnKeys: [],
						datasourceTableHookState: { ...reporting({ columnKeys: [] }), reset: mockReset },
					});

				setDatasourceTableHookState(reporting({ columnKeys: ['myDefaultColumn'] }));
				searchWithNewAql('objectType = "with results"');
				const searchButton = getByTestId('assets-datasource-modal--aql-search-button');
				await waitFor(() => {
					expect(searchButton).toBeEnabled();
				});
				searchButton.click();

				(await findByRole('button', { name: 'Update table' })).click();
				await waitFor(() => {
					expect(onInsert).toHaveBeenCalledTimes(1);
				});

				// There is nothing to keep, so the search takes the normal reset path
				expect(mockReset).toHaveBeenCalledWith({
					shouldResetColumns: true,
					shouldForceRequest: true,
				});
				const [insertedAdf] = onInsert.mock.calls[0];
				expect(
					insertedAdf.attrs.datasource.views[0].properties.columns.map(
						({ key }: { key: string }) => key,
					),
				).toEqual(['myDefaultColumn']);
			});

			// Opening the picker fetches the rest of the schema, which widens `columns` without changing
			// the reported defaults. That must not be mistaken for a new search result.
			describe('when the column picker loads the rest of the schema', () => {
				// `applySchemaProperties` only calls the setter when the value is not `isEqual`, so the
				// reported defaults keep their identity while the picker widens `columns`. Handing the
				// modal a fresh array instead would re-trigger the unrelated new-search effect and hide
				// whatever the restore effect does.
				const newSchemaDefaults = ['brandNewColumn'];

				const switchSchemaThenOpenPickerAndInsert = async () => {
					const {
						onInsert,
						selectNewSchema,
						searchWithNewAql,
						setDatasourceTableHookState,
						rerenderModal,
						getByTestId,
						findByRole,
					} = await setup({
						parameters: { ...getDefaultParameters(), aql: 'name like a', version: '2' },
						// What the macro was saved with, chosen against the original object schema
						visibleColumnKeys: ['myColumn'],
						datasourceTableHookState: reporting({ columnKeys: ['myColumn'] }),
					});

					// The new object schema reports its own columns
					setDatasourceTableHookState(reporting({ columnKeys: newSchemaDefaults }));
					await selectNewSchema('schemaTwo');
					searchWithNewAql('objectType = "in the new schema"');
					const searchButton = getByTestId('assets-datasource-modal--aql-search-button');
					await waitFor(() => {
						expect(searchButton).toBeEnabled();
					});
					searchButton.click();

					// The click's state update lands asynchronously, so the new schema has to finish
					// rendering before the picker step - otherwise both collapse into one render and the
					// journey is never actually exercised
					await act(async () => {});

					// The picker's metadata request makes the old schema's column selectable again
					setDatasourceTableHookState(
						reporting({
							columnKeys: ['brandNewColumn', 'myColumn'],
							defaultVisibleColumnKeys: newSchemaDefaults,
						}),
					);
					rerenderModal();

					(await findByRole('button', { name: 'Update table' })).click();
					await waitFor(() => {
						expect(onInsert).toHaveBeenCalledTimes(1);
					});

					const [insertedAdf] = onInsert.mock.calls[0];
					return insertedAdf.attrs.datasource.views[0].properties.columns.map(
						({ key }: { key: string }) => key,
					);
				};

				it("should not restore the previous schema's columns when the gate is on", async () => {
					passGate('platform_lp_sllv_preserve_assets_columns');

					await expect(switchSchemaThenOpenPickerAndInsert()).resolves.toEqual(['brandNewColumn']);
				});

				it("should not restore the previous schema's columns when the gate is off", async () => {
					failGate('platform_lp_sllv_preserve_assets_columns');

					await expect(switchSchemaThenOpenPickerAndInsert()).resolves.toEqual(['brandNewColumn']);
				});
			});

			it('should reset columns when the object schema changes even when the gate is on', async () => {
				passGate('platform_lp_sllv_preserve_assets_columns');
				const mockReset = jest.fn();

				const { selectNewSchema, clickSearchButton } = await setup({
					parameters: {
						...getDefaultParameters(),
						aql: 'name like a',
						version: '2',
					},
					visibleColumnKeys: ['myColumn', 'otherColumn'],
					datasourceTableHookState: {
						...getDefaultDataSourceTableHookState(),
						reset: mockReset,
					},
				});

				await selectNewSchema('schemaTwo');
				await clickSearchButton();

				await waitFor(() => {
					expect(mockReset).toHaveBeenCalledWith({
						shouldResetColumns: true,
						shouldForceRequest: true,
					});
				});
			});
		});

		// PCS-3839755: the zero-result search is the path the escalated customer actually hit, and it
		// behaves differently depending on platform_lp_sllv_ux_improvements, which decides whether the
		// hook applies the schema when there are no items.
		describe('when a search within the same object schema returns no results', () => {
			const macroColumnKeys = ['myColumn', 'otherColumn'];

			const searchToNoResultsAndInsert = async (reportedColumnKeys: string[]) => {
				const { onInsert, searchWithNewAql, setDatasourceTableHookState, getByTestId, findByRole } =
					await setup({
						parameters: { ...getDefaultParameters(), aql: 'name like a', version: '2' },
						visibleColumnKeys: macroColumnKeys,
						datasourceTableHookState: getDefaultDataSourceTableHookState(),
					});

				// The hook derives columns and the defaults from the same properties, so keep them in step
				setDatasourceTableHookState({
					...getDefaultDataSourceTableHookState(),
					columns: reportedColumnKeys.map((key) => ({ key, title: key, type: 'string' as const })),
					defaultVisibleColumnKeys: reportedColumnKeys,
					responseItems: [],
					responseItemIds: [],
					totalCount: 0,
				});

				searchWithNewAql('objectType = "matches nothing"');
				const searchButton = getByTestId('assets-datasource-modal--aql-search-button');
				await waitFor(() => {
					expect(searchButton).toBeEnabled();
				});
				searchButton.click();

				(await findByRole('button', { name: 'Update table' })).click();
				await waitFor(() => {
					expect(onInsert).toHaveBeenCalledTimes(1);
				});

				const [insertedAdf] = onInsert.mock.calls[0];
				return insertedAdf.attrs.datasource.views[0].properties.columns.map(
					({ key }: { key: string }) => key,
				);
			};

			it('should keep the selected columns when the schema is applied without items', async () => {
				passGate('platform_lp_sllv_preserve_assets_columns');
				passGate('platform_lp_sllv_ux_improvements');

				// The request still asks for the selection, so the schema comes back narrowed to it
				await expect(searchToNoResultsAndInsert(macroColumnKeys)).resolves.toEqual(macroColumnKeys);
			});
		});
	});

	it('should capture and report a11y violations', async () => {
		const { component } = await setup();

		await expect(component.container).toBeAccessible();
	});
});
