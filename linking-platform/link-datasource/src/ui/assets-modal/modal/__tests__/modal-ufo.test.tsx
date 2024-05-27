import { waitFor } from '@testing-library/react';

import { type ConcurrentExperience } from '@atlaskit/ufo';

import {
  defaultAssetsMeta,
  getDefaultDataSourceTableHookState,
  getEmptyDatasourceTableHookState,
  getErrorDatasourceTableHookState,
  setup,
} from './_utils';

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();
const mockUfoFailure = jest.fn();
const mockUfoAddMetadata = jest.fn();

const mockColumnPickerRenderUfoFailure = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/ufo'),
  ConcurrentExperience: (
    experienceId: string,
  ): Partial<ConcurrentExperience> => ({
    experienceId: experienceId,
    getInstance: jest.fn().mockImplementation(() => {
      if (experienceId === 'datasource-rendered') {
        return {
          start: mockUfoStart,
          success: mockUfoSuccess,
          failure: mockUfoFailure,
          addMetadata: mockUfoAddMetadata,
        };
      }
      if (experienceId === 'column-picker-rendered') {
        return {
          failure: mockColumnPickerRenderUfoFailure,
        };
      }
      return {
        // there are other experiences outside this tests scope that reference atlaskit/ufo
        start: jest.fn(),
        success: jest.fn(),
        failure: jest.fn(),
        addMetadata: jest.fn(),
      };
    }),
  }),
}));

describe('UFO metrics: AssetsConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start ufo experience when AssetsConfigModal status is loading', async () => {
    await setup({
      datasourceTableHookState: {
        ...getDefaultDataSourceTableHookState(),
        status: 'loading',
      },
    });
    await waitFor(() => {
      expect(mockUfoStart).toHaveBeenCalledTimes(1);
    });
  });

  it('should start ufo experience and set extensionKey metadata when AssetsConfigModal status is loading', async () => {
    await setup({
      datasourceTableHookState: {
        ...getDefaultDataSourceTableHookState(),
        status: 'loading',
      },
    });
    await waitFor(() => {
      expect(mockUfoStart).toHaveBeenCalledTimes(1);
      expect(mockUfoAddMetadata).toHaveBeenCalledTimes(1);
      expect(mockUfoAddMetadata).toHaveBeenCalledWith({
        extensionKey: defaultAssetsMeta.extensionKey,
      });
    });
  });

  it('should mark as a successful experience when AssetsConfigModal results are resolved', async () => {
    await setup();
    await waitFor(() => {
      expect(mockUfoSuccess).toHaveBeenCalledTimes(1);
      expect(mockUfoFailure).not.toHaveBeenCalled();
    });
  });

  it('should mark as a successful when AssetsConfigModal data request returns unauthorized response', async () => {
    await setup({
      datasourceTableHookState: {
        ...getErrorDatasourceTableHookState(),
        status: 'unauthorized',
      },
    });
    await waitFor(() => {
      expect(mockUfoSuccess).toHaveBeenCalledTimes(1);
      expect(mockUfoFailure).not.toHaveBeenCalled();
    });
  });

  it('should mark as a successful experience when AssetsConfigModal results are empty', async () => {
    await setup({
      datasourceTableHookState: {
        ...getEmptyDatasourceTableHookState(),
        status: 'resolved',
      },
    });
    await waitFor(() => {
      expect(mockUfoSuccess).toHaveBeenCalledTimes(1);
      expect(mockUfoFailure).not.toHaveBeenCalled();
    });
  });

  it('should mark as a successful experience when AssetsConfigModal result has only one item', async () => {
    await setup({
      datasourceTableHookState: {
        ...getDefaultDataSourceTableHookState(),
        responseItems: [
          {
            key: {
              data: {
                url: 'www.atlassian.com',
              },
            },
          },
        ],
      },
    });
    await waitFor(() => {
      expect(mockUfoSuccess).toHaveBeenCalled();
      expect(mockUfoFailure).not.toHaveBeenCalled();
    });
  });

  it('should mark as a failed experience when AssetsConfigModal request fails', async () => {
    await setup({
      datasourceTableHookState: { ...getErrorDatasourceTableHookState() },
    });
    await waitFor(() => {
      expect(mockUfoFailure).toHaveBeenCalledTimes(1);
      expect(mockUfoSuccess).not.toHaveBeenCalled();
    });
  });

  describe('ColumnPickerRendered', () => {
    it('should not mark as a failed experience when status is OK', async () => {
      await setup();
      await waitFor(() => {
        expect(mockColumnPickerRenderUfoFailure).not.toHaveBeenCalled();
      });
    });

    it('should mark as a failed experience when status is rejected', async () => {
      await setup({
        datasourceTableHookState: { ...getErrorDatasourceTableHookState() },
      });
      await waitFor(() => {
        expect(mockColumnPickerRenderUfoFailure).toHaveBeenCalledTimes(1);
      });
    });
  });
});
