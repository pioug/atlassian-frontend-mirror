import React from 'react';

import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { mockFieldValuesResponse, mockHydrateJqlResponse } from '../mocks';
import { useBasicFilterAGG } from '../useBasicFilterAGG';

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
  <SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
);

describe('useBasicFilterAGG', () => {
  let mockFetch: jest.Mock;

  const setup = () => {
    const { result } = renderHook(() => useBasicFilterAGG(), {
      wrapper,
    });

    const { getHydratedJQL, getFieldValues } = result.current;

    return {
      getHydratedJQL,
      getFieldValues,
    };
  };

  beforeEach(() => {
    jest.resetModules();
    mockFetch = jest.fn();
    (global as any).fetch = mockFetch;
  });

  it('returns datasource client extension methods', () => {
    const { result } = renderHook(() => useBasicFilterAGG(), {
      wrapper,
    });

    expect(result.current).toEqual({
      getFieldValues: expect.any(Function),
      getHydratedJQL: expect.any(Function),
    });
  });

  describe('#getHydratedJql', () => {
    const cloudId = 'my-cloud-id!';
    const jql = 'project=TEST';

    it('makes request to /graphql with expected arguments', async () => {
      const { getHydratedJQL } = setup();

      mockFetch.mockResolvedValueOnce({
        json: async () => undefined,
        ok: true,
        text: async () => undefined,
      });

      await getHydratedJQL(cloudId, jql);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          credentials: 'same-origin',
          headers: {
            map: {
              'content-type': 'application/json',
              'x-experimentalapi': 'JiraJqlBuilder',
            },
          },
          method: 'POST',
          url: 'http://localhost/graphql',
        }),
      );

      const fetchArgs = mockFetch.mock.calls[0][0];
      const bodyInitObj = JSON.parse(fetchArgs._bodyInit);
      expect(bodyInitObj.variables).toEqual(
        expect.objectContaining({
          cloudId,
          jql,
        }),
      );
    });

    it('returns success response', async () => {
      const { getHydratedJQL } = setup();

      const expectedResponse = mockHydrateJqlResponse;

      mockFetch.mockResolvedValueOnce({
        body: {},
        json: async () => expectedResponse,
        ok: true,
        text: async () => JSON.stringify(expectedResponse),
      });

      const response = await getHydratedJQL(cloudId, jql);

      expect(response).toEqual(expectedResponse);
    });

    it('returns error response', async () => {
      const { getHydratedJQL } = setup();

      const error = new Error();
      mockFetch.mockRejectedValueOnce(error);

      await expect(getHydratedJQL(cloudId, jql)).rejects.toThrow();
    });
  });

  describe('#getFieldValues', () => {
    const cloudId = 'my-cloud-id!';
    const jql = 'project=TEST';
    const jqlTerm = 'project';
    const searchString = 'TEST';
    const pageCursor = 'cursor!';

    it('makes request to /graphql with expected arguments', async () => {
      const { getFieldValues } = setup();

      mockFetch.mockResolvedValueOnce({
        json: async () => undefined,
        ok: true,
        text: async () => undefined,
      });

      await getFieldValues(cloudId, jql, jqlTerm, searchString, pageCursor);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          credentials: 'same-origin',
          headers: {
            map: {
              'content-type': 'application/json',
              'x-experimentalapi': 'JiraJqlBuilder',
            },
          },
          method: 'POST',
          url: 'http://localhost/graphql',
        }),
      );

      const fetchArgs = mockFetch.mock.calls[0][0];
      const bodyInitObj = JSON.parse(fetchArgs._bodyInit);
      expect(bodyInitObj.variables).toEqual(
        expect.objectContaining({
          cloudId,
          jql,
          jqlTerm,
          searchString,
          after: pageCursor,
        }),
      );
    });

    it('returns success response', async () => {
      const { getFieldValues } = setup();

      const expectedResponse = mockFieldValuesResponse;

      mockFetch.mockResolvedValueOnce({
        body: {},
        json: async () => expectedResponse,
        ok: true,
        text: async () => JSON.stringify(expectedResponse),
      });

      const response = await getFieldValues(
        cloudId,
        jql,
        jqlTerm,
        searchString,
        pageCursor,
      );

      expect(response).toEqual(expectedResponse);
    });

    it('throws an error when fetch throws', async () => {
      const { getFieldValues } = setup();

      const error = new Error();
      mockFetch.mockRejectedValueOnce(error);

      await expect(
        getFieldValues(cloudId, jql, jqlTerm, searchString, pageCursor),
      ).rejects.toThrow();
    });
  });
});
