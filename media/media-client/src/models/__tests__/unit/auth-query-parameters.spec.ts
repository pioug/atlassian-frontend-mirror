import {
  AuthQueryParameters,
  mapAuthToQueryParameters,
} from '../../auth-query-parameters';

describe('AuthQueryParameters', () => {
  describe('mapAuthToQueryParameters', () => {
    const clientId = 'some-client-id';
    const asapIssuer = 'some-asap-issuer';
    const token = 'some-token';
    const baseUrl = 'some-base-url';

    it('should return correct query parameters for client based auth', () => {
      expect(
        mapAuthToQueryParameters({
          clientId,
          token,
          baseUrl,
        }),
      ).toEqual({ client: clientId, token } as AuthQueryParameters);
    });

    it('should return correct query parameters for asap based auth', () => {
      expect(
        mapAuthToQueryParameters({
          asapIssuer,
          token,
          baseUrl,
        }),
      ).toEqual({ issuer: asapIssuer, token } as AuthQueryParameters);
    });
  });
});
