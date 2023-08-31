import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../../../analytics';
import {
  useAssetsClient,
  UseAssetsClientState,
} from '../../../../hooks/useAssetsClient';
import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../../../hooks/useDatasourceTableState';
import {
  useObjectSchemas,
  UseObjectSchemasState,
} from '../../../../hooks/useObjectSchemas';
import { AssetsDatasourceParameters } from '../../types';
import { AssetsConfigModal } from '../index'; // Using async one to test lazy integration at the same time

jest.mock('../../../../hooks/useDatasourceTableState');
jest.mock('../../../../hooks/useAssetsClient');
jest.mock('../../../../hooks/useObjectSchemas');

describe('AssetsConfigModal', () => {
  const getDefaultParameters: () => AssetsDatasourceParameters = () => ({
    workspaceId: 'some-workspace-id',
    aql: 'some-query',
    schemaId: '123',
  });

  const getDefaultDataSourceTableHookState: () => DatasourceTableState =
    () => ({
      reset: jest.fn(),
      status: 'resolved',
      onNextPage: jest.fn(),
      loadDatasourceDetails: jest.fn(),
      hasNextPage: false,
      responseItems: [
        {
          myColumn: { data: 'some-value' },
          otherColumn: { data: 'other-column-value' },
          myId: { data: 'some-id1' },
        },
        {
          myColumn: { data: 'other-value' },
          otherColumn: { data: 'other-column-other-value' },
          myId: { data: 'some-id2' },
        },
      ],
      columns: [
        { key: 'myColumn', title: 'My Column', type: 'string' },
        { key: 'otherColumn', title: 'My Other Column', type: 'string' },
        { key: 'myId', title: 'ID', type: 'string', isIdentity: true },
      ],
      defaultVisibleColumnKeys: ['myDefaultColumn', 'otherDefaultColumn'],
      totalCount: 3,
      destinationObjectTypes: ['issue'],
      extensionKey: 'jira-object-provider',
    });

  const getSingleAssetHookState: () => DatasourceTableState = () => ({
    ...getDefaultDataSourceTableHookState(),
    responseItems: [
      {
        key: {
          data: {
            url: 'hello.com',
          },
        },
      },
    ],
  });

  const getEmptyDatasourceTableHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'empty',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
    totalCount: undefined,
    destinationObjectTypes: [],
    extensionKey: undefined,
  });
  const getErrorDatasourceTableHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'rejected',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
    totalCount: undefined,
    destinationObjectTypes: ['issue'],
    extensionKey: 'jira-object-provider',
  });
  const getLoadingDatasourceTableHookState: () => DatasourceTableState =
    () => ({
      columns: [],
      status: 'loading',
      responseItems: [],
      hasNextPage: true,
      defaultVisibleColumnKeys: [],
      onNextPage: jest.fn(),
      loadDatasourceDetails: jest.fn(),
      reset: jest.fn(),
      destinationObjectTypes: ['issue'],
      extensionKey: 'jira-object-provider',
    });

  const getObjectSchemasDefaultHookState: () => UseObjectSchemasState = () => ({
    fetchObjectSchemas: jest.fn(),
    objectSchemasError: undefined,
    objectSchemasLoading: false,
    objectSchemas: undefined,
  });

  const getAssetsClientDefaultHookState: () => UseAssetsClientState = () => ({
    workspaceId: 'some-workspace-id',
    workspaceError: undefined,
    objectSchema: undefined,
    assetsClientLoading: false,
  });

  const getAssetsClientLoadingHookState: () => UseAssetsClientState = () => ({
    workspaceId: undefined,
    workspaceError: undefined,
    objectSchema: undefined,
    assetsClientLoading: true,
  });

  const getAssetsClientErrorHookState: () => UseAssetsClientState = () => ({
    workspaceId: undefined,
    workspaceError: new Error('workspaceError'),
    objectSchema: undefined,
    assetsClientLoading: false,
  });

  const setup = async (
    args: {
      parameters?: AssetsDatasourceParameters;
      datasourceTableHookState?: DatasourceTableState;
      assetsClientHookState?: UseAssetsClientState;
      visibleColumnKeys?: string[];
    } = {},
  ) => {
    asMock(useDatasourceTableState).mockReturnValue(
      args.datasourceTableHookState || getDefaultDataSourceTableHookState(),
    );
    asMock(useAssetsClient).mockReturnValue(
      args.assetsClientHookState || getAssetsClientDefaultHookState(),
    );
    asMock(useObjectSchemas).mockReturnValue(
      getObjectSchemasDefaultHookState(),
    );

    const onCancel = jest.fn();
    const onInsert = jest.fn();
    const onAnalyticFireEvent = jest.fn();

    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(
        <AnalyticsListener
          channel={EVENT_CHANNEL}
          onEvent={onAnalyticFireEvent}
        >
          <IntlProvider locale="en">
            <AssetsConfigModal
              datasourceId={'some-assets-datasource-id'}
              parameters={
                Object.keys(args).includes('parameters')
                  ? args.parameters
                  : getDefaultParameters()
              }
              onCancel={onCancel}
              onInsert={onInsert}
              visibleColumnKeys={
                Object.keys(args).includes('visibleColumnKeys')
                  ? args.visibleColumnKeys
                  : ['myColumn']
              }
            />
          </IntlProvider>
          ,
        </AnalyticsListener>,
      );
    return {
      ...renderComponent(),
      onCancel,
      onInsert,
      onAnalyticFireEvent,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

  describe('when there is no parameters yet', () => {
    it('should display initial state', async () => {
      const { queryByTestId } = await setup({
        datasourceTableHookState: getEmptyDatasourceTableHookState(),
        parameters: undefined,
      });
      expect(
        queryByTestId('assets-aql-datasource-modal--initial-state-view'),
      ).toBeTruthy();
    });

    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { workspaceId: '', aql: '', schemaId: '' },
        datasourceTableHookState: getEmptyDatasourceTableHookState(),
      });
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
    });
  });

  describe('when datasource table status is `loading` and parameters provided', () => {
    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { workspaceId: 'abc123', aql: 'cool', schemaId: '123' },
        datasourceTableHookState: getLoadingDatasourceTableHookState(),
      });
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
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

        expect(insertButton).toBeEnabled();
        insertButton.click();

        expect(onInsert).toHaveBeenCalledWith({
          type: 'inlineCard',
          attrs: {
            url: 'hello.com',
          },
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

        expect(insertButton).toBeEnabled();
        insertButton.click();

        expect(onInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'blockCard',
          }),
        );
      });
      it('should insert blockCard adf when response does not have a "key" prop', async () => {
        const datasourceTableHookState = getSingleAssetHookState();
        datasourceTableHookState.responseItems = [{}];
        const { getByRole, onInsert } = await setup({
          datasourceTableHookState,
        });
        const insertButton = getByRole('button', { name: 'Insert object' });

        expect(insertButton).toBeEnabled();
        insertButton.click();

        expect(onInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'blockCard',
          }),
        );
      });
      it('should insert blockCard adf when more than 1 asset is returned', async () => {
        const { getByRole, onInsert } = await setup({});
        const insertButton = getByRole('button', { name: 'Insert objects' });

        expect(insertButton).toBeEnabled();
        insertButton.click();

        expect(onInsert).toHaveBeenCalledWith({
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
        });
      });
      it('should insert blockCard adf with default column keys when visibleColumnKeys is undefined', async () => {
        const { getByRole, onInsert } = await setup({
          visibleColumnKeys: undefined,
        });
        const insertButton = getByRole('button', { name: 'Insert objects' });

        expect(insertButton).toBeEnabled();
        insertButton.click();

        expect(onInsert).toHaveBeenCalledWith({
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

        expect(insertButton).toBeEnabled();
        insertButton.click();

        expect(onInsert).toHaveBeenCalledWith({
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
      expect(insertButton).toBeInTheDocument();
    });

    it("should show insert button with 'Insert objects' text when more than one asset is returned", async () => {
      const datasourceTableHookState = getDefaultDataSourceTableHookState();
      const { getByRole } = await setup({
        datasourceTableHookState,
      });
      const insertButton = getByRole('button', {
        name: 'Insert objects',
      });
      expect(insertButton).toBeInTheDocument();
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
      expect(getByText('No results found')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert objects' })).toBeEnabled();
    });
  });

  describe('when an error occurs on data request', () => {
    it('should show network error message', async () => {
      const { getByRole, getByText } = await setup({
        datasourceTableHookState: { ...getErrorDatasourceTableHookState() },
      });
      expect(getByText('Unable to load results')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
    });
  });
});
