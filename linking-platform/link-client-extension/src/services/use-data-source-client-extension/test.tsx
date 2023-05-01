import React from 'react';

import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { NetworkError } from '@atlaskit/linking-common';
import type {
  DatasourceDataRequest,
  DatasourceDataResponse,
  DatasourceParameters,
  DatasourceResponse,
} from '@atlaskit/linking-types';

import { mockDatasourceDataResponse, mockDatasourceResponse } from './mocks';

import { useDatasourceClientExtension } from './index';

const allErrorCodes = [
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
  415, 416, 417, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501,
  502, 503, 504, 505, 506, 507, 508, 511,
];

const datasourceId: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
  <SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
);

describe('useDatasourceClientExtension', () => {
  let mockFetch: jest.Mock;

  const setup = () => {
    const datasourceDetailsParams: DatasourceParameters = {
      cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
      jql: 'project=EDM',
    };

    const datasourceDataParams: DatasourceDataRequest = {
      fields: ['summary', 'issueType', 'status'],
      parameters: {
        cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
        jql: 'project = EDM',
      },
      pageSize: 10,
      pageCursor: 'c3RhcnRBdD01',
    };

    const { result } = renderHook(() => useDatasourceClientExtension(), {
      wrapper,
    });

    const { getDatasourceDetails, getDatasourceData } = result.current;

    return {
      getDatasourceDetails,
      getDatasourceData,
      datasourceDetailsParams,
      datasourceDataParams,
    };
  };

  beforeEach(() => {
    jest.resetModules();
    mockFetch = jest.fn();
    (global as any).fetch = mockFetch;
  });

  it('returns datasource client extension methods', () => {
    const { result } = renderHook(() => useDatasourceClientExtension(), {
      wrapper,
    });

    expect(result.current).toEqual({
      getDatasourceDetails: expect.any(Function),
      getDatasourceData: expect.any(Function),
    });
  });

  describe('#getDatasourceDetails', () => {
    it('makes request to /datasource/<datasourceId>/fetch/details', async () => {
      const { getDatasourceDetails, datasourceDetailsParams } = setup();

      mockFetch.mockResolvedValueOnce({
        json: async () => undefined,
        ok: true,
        text: async () => undefined,
      });

      await getDatasourceDetails(datasourceId, datasourceDetailsParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/datasource/${datasourceId}/fetch/details`),
        {
          body: JSON.stringify(datasourceDetailsParams),
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
          },
          method: 'post',
        },
      );
    });

    it('returns error response', async () => {
      const { getDatasourceDetails, datasourceDetailsParams } = setup();

      const error = new Error();
      mockFetch.mockRejectedValueOnce(error);

      await expect(
        getDatasourceDetails(datasourceId, datasourceDetailsParams),
      ).rejects.toBe(error);
    });

    it.each(allErrorCodes)('throws %s response', async (status: number) => {
      const { getDatasourceDetails, datasourceDetailsParams } = setup();

      const expectedResponse = { ok: false, status };
      mockFetch.mockResolvedValueOnce(expectedResponse);

      await expect(
        getDatasourceDetails(datasourceId, datasourceDetailsParams),
      ).rejects.toBe(expectedResponse);
    });

    it('throws network error on string error', async () => {
      const { getDatasourceDetails, datasourceDetailsParams } = setup();

      const errorMessage = 'API is down';
      mockFetch.mockRejectedValueOnce(errorMessage);

      await expect(
        getDatasourceDetails(datasourceId, datasourceDetailsParams),
      ).rejects.toThrow(new NetworkError(errorMessage));
    });

    it('throws network error response on TypeError', async () => {
      const { getDatasourceDetails, datasourceDetailsParams } = setup();

      const error = TypeError('null has no properties');
      mockFetch.mockRejectedValueOnce(error);

      await expect(
        getDatasourceDetails(datasourceId, datasourceDetailsParams),
      ).rejects.toThrow(new NetworkError(error));
    });

    it('returns success response', async () => {
      const { getDatasourceDetails, datasourceDetailsParams } = setup();

      const expectedResponse: DatasourceResponse = mockDatasourceResponse;

      mockFetch.mockResolvedValueOnce({
        body: '{}',
        json: async () => expectedResponse,
        ok: true,
        text: async () => JSON.stringify(expectedResponse),
      });

      const actualResponse = await getDatasourceDetails(
        datasourceId,
        datasourceDetailsParams,
      );

      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('#getDatasourceData', () => {
    it('makes request to /datasource/<datasourceId>/fetch/data', async () => {
      const { getDatasourceData, datasourceDataParams } = setup();

      mockFetch.mockResolvedValueOnce({
        json: async () => undefined,
        ok: true,
        text: async () => undefined,
      });

      await getDatasourceData(datasourceId, datasourceDataParams);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/datasource/${datasourceId}/fetch/data`),
        {
          body: JSON.stringify(datasourceDataParams),
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
          },
          method: 'post',
        },
      );
    });

    it('returns error response', async () => {
      const { getDatasourceData, datasourceDataParams } = setup();

      const error = new Error();
      mockFetch.mockRejectedValueOnce(error);

      await expect(
        getDatasourceData(datasourceId, datasourceDataParams),
      ).rejects.toBe(error);
    });

    it.each(allErrorCodes)('throws %s response', async (status: number) => {
      const { getDatasourceData, datasourceDataParams } = setup();

      const expectedResponse = { ok: false, status };
      mockFetch.mockResolvedValueOnce(expectedResponse);

      await expect(
        getDatasourceData(datasourceId, datasourceDataParams),
      ).rejects.toBe(expectedResponse);
    });

    it('throws network error on string error', async () => {
      const { getDatasourceData, datasourceDataParams } = setup();

      const errorMessage = 'API is down';
      mockFetch.mockRejectedValueOnce(errorMessage);

      await expect(
        getDatasourceData(datasourceId, datasourceDataParams),
      ).rejects.toThrow(new NetworkError(errorMessage));
    });

    it('throws network error response on TypeError', async () => {
      const { getDatasourceData, datasourceDataParams } = setup();

      const error = TypeError('null has no properties');
      mockFetch.mockRejectedValueOnce(error);

      await expect(
        getDatasourceData(datasourceId, datasourceDataParams),
      ).rejects.toThrow(new NetworkError(error));
    });

    it('returns success response', async () => {
      const { getDatasourceData, datasourceDataParams } = setup();

      const expectedResponse: DatasourceDataResponse =
        mockDatasourceDataResponse;

      mockFetch.mockResolvedValueOnce({
        body: {},
        json: async () => expectedResponse,
        ok: true,
        text: async () => JSON.stringify(expectedResponse),
      });

      const response = await getDatasourceData(
        datasourceId,
        datasourceDataParams,
      );

      expect(response).toEqual(expectedResponse);
    });
  });
});
