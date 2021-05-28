import fetchMock from 'fetch-mock/cjs/client';
import { Service } from '../../../../domain';
import { flattenAccounts } from '../../fetcher';

describe('Fetcher', () => {
  afterEach(fetchMock.restore);

  describe('flattenAccounts()', () => {
    const services: Service[] = [
      {
        type: 'dropbox',
        status: 'available',
        accounts: [
          {
            id: 'dropbox|111111111',
            status: 'available',
            displayName: 'user@atlassian.com',
          },
        ],
      },
      {
        type: 'google',
        status: 'available',
        accounts: [],
      },
    ];

    it('flattens the response data into a list of accounts', () => {
      const flattened = flattenAccounts(services);
      expect(flattened).toEqual([
        {
          id: 'dropbox|111111111',
          status: 'available',
          displayName: 'user@atlassian.com',
          type: 'dropbox',
        },
      ]);
    });
  });
});
