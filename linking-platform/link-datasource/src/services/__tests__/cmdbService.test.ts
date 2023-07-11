import fetchMock from 'fetch-mock/cjs/client';

import {
  fetchObjectSchemas,
  getWorkspaceId,
  validateAql,
} from '../cmdbService';

describe('cmdbService', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  const workspaceId = 'workspaceId';

  describe('getWorkspaceId', () => {
    const mockResponseWithHostname = {
      results: [
        {
          id: '5',
        },
      ],
    };

    const mockResponseWithoutHostname = {
      results: [
        {
          id: '1',
        },
      ],
    };

    it.each([
      ['randomHostname', mockResponseWithHostname],
      [undefined, mockResponseWithoutHostname],
    ])(
      'should return correct response when hostname is %s',
      async (hostname, expectedMockResponse) => {
        const mock = fetchMock.get({
          url: `${hostname || ''}/rest/servicedesk/cmdb/latest/workspace`,
          response: expectedMockResponse,
        });

        const response = await getWorkspaceId(hostname);

        expect(mock.calls()).toHaveLength(1);
        expect(mock.done()).toBe(true);
        expect(response).toEqual(expectedMockResponse.results[0].id);
      },
    );

    it('should throw error if response results is empty', async () => {
      const mockResponse = {
        results: [],
      };
      const mock = fetchMock.get({
        url: '/rest/servicedesk/cmdb/latest/workspace',
        response: mockResponse,
      });

      await expect(getWorkspaceId).rejects.toThrow(
        'No workspace results found',
      );
      expect(mock.calls()).toHaveLength(1);
      expect(mock.done()).toBe(true);
    });
  });

  describe('validateAql', () => {
    const mockResponseWithHostname = {
      isValid: true,
    };

    const mockResponseWithoutHostname = {
      isValid: false,
    };

    it.each([
      ['randomHostname', { qlQuery: 'valid aql' }, mockResponseWithHostname],
      [undefined, { qlQuery: 'invalidAql' }, mockResponseWithoutHostname],
    ])(
      'should return correct response when hostname is %s and data is %o',
      async (hostname = undefined, aql, expectedMockResponse) => {
        const mock = fetchMock.post({
          url: `${
            hostname || ''
          }/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`,
          response: expectedMockResponse,
          body: {
            qlQuery: aql.qlQuery,
            context: 'SMART_LINKS',
          },
        });

        const response = await validateAql(workspaceId, aql, hostname);

        expect(mock.calls()).toHaveLength(1);
        expect(mock.done()).toBe(true);
        expect(response).toEqual(expectedMockResponse);
      },
    );
  });

  describe('fetchObjectSchemas', () => {
    const mockResponseWithHostname = {
      values: [
        {
          id: '1',
          name: 'objSchema1',
        },
      ],
    };

    const mockResponseWithoutHostname = {
      values: [
        {
          id: '2',
          name: 'objSchema2',
        },
      ],
    };

    it.each([
      ['randomHostname', mockResponseWithHostname],
      [undefined, mockResponseWithoutHostname],
    ])(
      'should return correct response when hostname is %s',
      async (hostname = undefined, expectedMockResponse) => {
        const mock = fetchMock.get({
          url: `${
            hostname || ''
          }/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?maxResults=100`,
          response: expectedMockResponse,
        });

        const response = await fetchObjectSchemas(workspaceId, hostname);

        expect(mock.calls()).toHaveLength(1);
        expect(mock.done()).toBe(true);
        expect(response).toEqual(expectedMockResponse);
      },
    );
  });
});
