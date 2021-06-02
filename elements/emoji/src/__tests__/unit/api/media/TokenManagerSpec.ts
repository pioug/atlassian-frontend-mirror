import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';

import TokenManager from '../../../../api/media/TokenManager';

import {
  defaultMediaApiToken,
  expiresAt,
  siteServiceConfig,
  siteUrl,
} from '../../_test-data';

const tokenReadUrl = `${siteUrl}/token/read`;
const tokenUploadUrl = `${siteUrl}/token/upload`;

describe('TokenManager', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('#addToken', () => {
    it('added token immediately available from getToken read', () => {
      const tokenManager = new TokenManager({
        url: siteServiceConfig.url,
      });
      const addedToken = defaultMediaApiToken();
      tokenManager.addToken('read', addedToken);
      return tokenManager.getToken('read').then((token) => {
        expect(token).toEqual(addedToken);
      });
    });
  });

  describe('#getToken', () => {
    it('get initial read token refreshed from server', () => {
      const expectedToken = defaultMediaApiToken();
      fetchMock.mock({
        matcher: tokenReadUrl,
        response: {
          body: expectedToken,
        },
        name: 'token-read',
      });
      const tokenManager = new TokenManager({
        url: siteServiceConfig.url,
      });
      return tokenManager.getToken('read').then((token) => {
        expect(token).toEqual(expectedToken);
        expect(fetchMock.calls('token-read').length).toEqual(1);
      });
    });

    it('second get read returns current token', () => {
      const expectedToken = defaultMediaApiToken();
      fetchMock.mock({
        matcher: tokenReadUrl,
        response: {
          body: expectedToken,
        },
        name: 'token-read',
      });
      const tokenManager = new TokenManager({
        url: siteServiceConfig.url,
      });
      return tokenManager
        .getToken('read')
        .then((token) => {
          expect(token).toEqual(expectedToken);
          expect(fetchMock.calls('token-read').length).toEqual(1);
          return tokenManager.getToken('read');
        })
        .then((token) => {
          expect(token).toEqual(expectedToken);
          expect(fetchMock.calls('token-read').length).toEqual(1);
        });
    });

    it('second get with force read returns new token', () => {
      const expectedToken1 = defaultMediaApiToken();
      const expectedToken2 = {
        ...defaultMediaApiToken(),
        expiresAt: expiresAt(500),
        clientId: 'forced-refresh',
      };
      fetchMock
        .mock({
          matcher: tokenReadUrl,
          response: {
            body: expectedToken1,
          },
          name: 'token-read-1',
          repeat: 1,
        })
        .mock({
          matcher: tokenReadUrl,
          response: {
            body: expectedToken2,
          },
          name: 'token-read-2',
        });

      const tokenManager = new TokenManager({
        url: siteServiceConfig.url,
      });

      return tokenManager
        .getToken('read')
        .then((token) => {
          expect(token).toEqual(expectedToken1);
          expect(fetchMock.calls('token-read-1').length).toEqual(1);
          return tokenManager.getToken('read', true);
        })
        .then((token) => {
          expect(token).toEqual(expectedToken2);
          expect(fetchMock.calls('token-read-2').length).toEqual(1);
        });
    });

    it('get expired read token refreshes from server', () => {
      const tokenManager = new TokenManager({
        url: siteServiceConfig.url,
      });

      const addedToken = {
        ...defaultMediaApiToken(),
        expiresAt: expiresAt(-60),
      };

      const expectedToken = defaultMediaApiToken();
      fetchMock.mock({
        matcher: tokenReadUrl,
        response: {
          body: expectedToken,
        },
        name: 'token-read',
      });

      tokenManager.addToken('read', addedToken);
      return tokenManager.getToken('read').then((token) => {
        expect(token).toEqual(expectedToken);
        expect(fetchMock.calls('token-read').length).toEqual(1);
      });
    });

    it('read / upload tokens are separate tokens', () => {
      const expectedReadToken = {
        ...defaultMediaApiToken(),
        clientId: 'read',
      };
      const expectedUploadToken = {
        ...defaultMediaApiToken(),
        clientId: 'upload',
      };

      fetchMock
        .mock({
          matcher: tokenReadUrl,
          response: {
            body: expectedReadToken,
          },
          name: 'token-read',
        })
        .mock({
          matcher: tokenUploadUrl,
          response: {
            body: expectedUploadToken,
          },
          name: 'token-upload',
        });

      const tokenManager = new TokenManager({
        url: siteServiceConfig.url,
      });
      return tokenManager
        .getToken('read')
        .then((token) => {
          expect(token).toEqual(expectedReadToken);
          expect(fetchMock.calls('token-read').length).toEqual(1);
          return tokenManager.getToken('upload');
        })
        .then((token) => {
          expect(token).toEqual(expectedUploadToken);
          expect(fetchMock.calls('token-upload').length).toEqual(1);
        });
    });
  });
});
