import fetchMock from 'fetch-mock/cjs/client';
import { StargateClient } from '../../client/stargate-client';

describe('StargateClient', () => {
  const baseUrl = 'http://stargate-base-url';
  let stargateClient: StargateClient;

  beforeEach(() => {
    stargateClient = new StargateClient(baseUrl);
  });

  afterEach(fetchMock.restore);

  describe('constructor', () => {
    it('sets default base url when none is provided', async () => {
      const client = new StargateClient(undefined);
      fetchMock.get('*', {});
      await client.fetchToken('some-client-id');
      expect(fetchMock.lastUrl()).toEqual('/gateway/api/media/auth/smartedge');
    });
  });

  describe('fetchToken', () => {
    it('fetches token with client id', async () => {
      const response = {
        data: {
          clientId: 'response-client-id',
          token: 'response-token',
          baseUrl: 'response-base-url',
          expiresIn: 10,
          iat: 100,
        },
      };
      fetchMock.get('*', response);

      const token = await stargateClient.fetchToken('some-client-id');
      const { headers } = fetchMock.lastOptions() || {};

      expect(token).toEqual(response);
      expect(fetchMock.lastUrl()).toEqual(`${baseUrl}/media/auth/smartedge`);
      expect(headers).toEqual({ 'x-client-id': 'some-client-id' });
    });
  });

  describe('isTokenExpired', () => {
    it('tests expired token', () => {
      const token = {
        data: {
          clientId: 'response-client-id',
          token: 'response-token',
          baseUrl: 'response-base-url',
          expiresIn: 0,
          iat: new Date().getTime() / 1000 - 100,
        },
      };

      expect(stargateClient.isTokenExpired(token)).toBe(true);
    });

    it('tests valid token', () => {
      const token = {
        data: {
          clientId: 'response-client-id',
          token: 'response-token',
          baseUrl: 'response-base-url',
          expiresIn: 100,
          iat: new Date().getTime() / 1000,
        },
      };

      expect(stargateClient.isTokenExpired(token)).toBe(false);
    });
  });
});
