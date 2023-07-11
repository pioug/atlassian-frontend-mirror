import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../../../hooks/useDatasourceTableState';
import { AssetsDatasourceParameters } from '../../types';
import { AssetsConfigModal } from '../index'; // Using async one to test lazy integration at the same time

jest.mock('../../../../hooks/useDatasourceTableState');

describe('AssetsConfigModal', () => {
  const getDefaultParameters: () => AssetsDatasourceParameters = () => ({
    cloudId: '67899',
    aql: 'some-query',
  });

  const getDefaultHookState: () => DatasourceTableState = () => ({
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
    defaultVisibleColumnKeys: ['myColumn', 'otherColumn'],
    totalCount: 3,
  });

  const getEmptyHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'empty',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
    totalCount: undefined,
  });
  const getErrorHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'rejected',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
    totalCount: undefined,
  });
  const getLoadingHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'loading',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
  });

  const setup = async (
    args: {
      parameters?: AssetsDatasourceParameters;
      hookState?: DatasourceTableState;
      visibleColumnKeys?: string[];
      dontWaitForSitesToLoad?: boolean;
    } = {},
  ) => {
    asMock(useDatasourceTableState).mockReturnValue(
      args.hookState || getDefaultHookState(),
    );
    const onCancel = jest.fn();
    const onInsert = jest.fn();
    let renderFunction = render;
    const renderComponent = () =>
      renderFunction(
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
        </IntlProvider>,
      );
    return {
      ...renderComponent(),
      onCancel,
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

  describe('when there is no parameters yet', () => {
    it('should display EmptyState', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: undefined,
      });
      expect(
        queryByTestId('assets-aql-datasource-modal--empty-state'),
      ).toBeTruthy();
    });

    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: '', aql: '' },
        hookState: getEmptyHookState(),
      });
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
    });
  });

  describe('when status is `loading` and parameters provided', () => {
    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: 'abc123', aql: 'cool' },
        hookState: getLoadingHookState(),
      });
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
    });
  });

  describe('when no assets are returned', () => {
    it('should show no results screen in assets view mode', async () => {
      const { getByRole, getByText } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
      });
      expect(getByText('No results found')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
    });
  });

  describe('when an error occurs on data request', () => {
    it('should show network error message', async () => {
      const { getByRole, getByText } = await setup({
        hookState: { ...getErrorHookState() },
      });
      expect(getByText('Unable to load results')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert objects' })).toBeDisabled();
    });
  });
});
