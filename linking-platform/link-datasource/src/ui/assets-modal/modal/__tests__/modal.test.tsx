import { fireEvent, waitFor } from '@testing-library/react';

import { EVENT_CHANNEL } from '../../../../analytics';

import {
  getAssetsClientErrorHookState,
  getAssetsClientLoadingHookState,
  getDefaultDataSourceTableHookState,
  getDefaultParameters,
  getEmptyDatasourceTableHookState,
  getErrorDatasourceTableHookState,
  getLoadingDatasourceTableHookState,
  getSingleAssetHookState,
  geValidateAqlTextDefaultHookState,
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
      assetsClientHookState: getAssetsClientLoadingHookState(),
    });
    expect(
      getByTestId('assets-datasource-modal--search-container-skeleton'),
    ).toBeInTheDocument();
    expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
  });

  it('should show error when workspace fetch fails', async () => {
    const { getByTestId } = await setup({
      assetsClientHookState: getAssetsClientErrorHookState(),
    });
    expect(
      getByTestId('jira-jql-datasource-modal--loading-error'),
    ).toBeInTheDocument();
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
              packageName: '@atlaskit/fabric',
              packageVersion: '0.0.0',
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
        expect(
          queryByTestId('assets-aql-datasource-modal--initial-state-view'),
        ).toBeTruthy();
      });
    });

    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { workspaceId: '', aql: '', schemaId: '' },
        datasourceTableHookState: getEmptyDatasourceTableHookState(),
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
        parameters: { workspaceId: 'abc123', aql: 'cool', schemaId: '123' },
        datasourceTableHookState: getLoadingDatasourceTableHookState(),
      });
      await waitFor(() => {
        expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
      });
    });
  });

  describe('when isDisabled is false', () => {
    describe('and user clicks button', () => {
      it('should insert inlineCard adf when 1 asset is returned and valid url is available', async () => {
        const datasourceTableHookState = getSingleAssetHookState();
        const { getByRole, onInsert } = await setup({
          datasourceTableHookState,
        });
        const insertButton = getByRole('button', { name: 'Insert object' });

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
        const insertButton = getByRole('button', { name: 'Insert object' });
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
          const insertButton = getByRole('button', { name: 'Insert object' });

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
      it('should insert blockCard adf when more than 1 asset is returned', async () => {
        const { getByRole, onInsert } = await setup();
        const insertButton = getByRole('button', { name: 'Insert objects' });
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
        const insertButton = getByRole('button', { name: 'Insert objects' });
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
      it('should insert initial columns if no response items are returned', async () => {
        const { getByRole, onInsert } = await setup({
          datasourceTableHookState: {
            ...getDefaultDataSourceTableHookState(),
            responseItems: [],
          },
        });
        const insertButton = getByRole('button', { name: 'Insert objects' });
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
    });
    it("should show insert button with 'Insert object' text when only one asset is returned", async () => {
      const datasourceTableHookState = getSingleAssetHookState();
      const { getByRole } = await setup({
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
        datasourceTableHookState,
      });
      const insertButton = getByRole('button', {
        name: 'Insert objects',
      });
      await waitFor(() => {
        expect(insertButton).toBeInTheDocument();
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
        expect(getByText('No results found')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Insert objects' })).toBeEnabled();
      });
    });
  });

  describe('when an error occurs on data request', () => {
    it('should show network error message', async () => {
      const { getByRole, getByText } = await setup({
        datasourceTableHookState: getErrorDatasourceTableHookState(),
      });
      await waitFor(() => {
        expect(getByText('Unable to load results')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
      });
    });
  });

  describe('when handling column resetting in search query', () => {
    it('should reset columns when search has changed', async () => {
      const mockReset = jest.fn();
      const mockValidateAqlText = jest.fn().mockResolvedValue({
        isValid: true,
        message: null,
      });

      const { getByTestId } = await setup({
        parameters: {
          ...getDefaultParameters(),
          aql: 'name like a',
        },
        datasourceTableHookState: {
          ...getDefaultDataSourceTableHookState(),
          reset: mockReset,
        },
        validateAqlTextHookState: {
          ...geValidateAqlTextDefaultHookState(),
          validateAqlText: mockValidateAqlText,
        },
      });

      // Change the AQL query to something else
      const textInput = getByTestId(
        'assets-datasource-modal--aql-search-input',
      );
      fireEvent.focus(textInput);
      fireEvent.change(textInput, {
        target: { value: 'objectType = "test aql query"' },
      });

      await waitFor(() => {
        expect(mockValidateAqlText).toBeCalledTimes(1);
        expect(mockValidateAqlText).toBeCalledWith(
          'objectType = "test aql query"',
        );
      });

      // Click on search button once the query is valid and button is enabled
      const searchButton = await getByTestId(
        'assets-datasource-modal--aql-search-button',
      );
      await waitFor(() => {
        expect(searchButton).toBeEnabled();
      });
      await searchButton.click();

      // Reset of columns should be applied because query has changed
      await waitFor(() => {
        expect(mockReset).toBeCalledTimes(1);
        expect(mockReset).toHaveBeenCalledWith({ shouldResetColumns: true });
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
      const textInput = getByTestId(
        'assets-datasource-modal--aql-search-input',
      );
      fireEvent.focus(textInput);
      fireEvent.change(textInput, {
        target: { value: 'name like a' },
      });

      // Click on search button
      const searchButton = await getByTestId(
        'assets-datasource-modal--aql-search-button',
      );
      await waitFor(() => {
        expect(searchButton).toBeEnabled();
      });
      await searchButton.click();

      // Reset of columns should not be applied because query is the same.
      await waitFor(() => {
        expect(mockReset).toBeCalledTimes(0);
      });
    });
  });
});
