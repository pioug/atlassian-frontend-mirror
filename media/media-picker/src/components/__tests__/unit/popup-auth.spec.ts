import { createPopupUserAuthProvider } from '../../popup-auth';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

describe('Popup Auth', () => {
  const tenantClientId = 'tenant-client-id';
  const mediaClient = fakeMediaClient({
    authProvider: () =>
      Promise.resolve({
        clientId: tenantClientId,
        token: '',
        baseUrl: 'some-api-url',
      }),
  });

  describe('createPopupUserAuthProvider', () => {
    beforeEach(() => {
      (mediaClient.stargate.fetchToken as jest.Mock).mockClear();
      (mediaClient.stargate.isTokenExpired as jest.Mock).mockClear();
    });

    it('requests stargate token with client id', async () => {
      const userAuthProvider = createPopupUserAuthProvider(
        mediaClient.stargate,
        mediaClient.config,
      );

      const auth = await userAuthProvider();

      expect(mediaClient.stargate.fetchToken).toHaveBeenCalledWith(
        tenantClientId,
      );
      expect(auth.token).toEqual('some-token-from-smart-edge');
    });

    it('requests stargate token with client id from ASAP token', async () => {
      const jwtToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6ImNsaWVudC1pZC1mcm9tLWFzYXAiLCJpYXQiOjE1ODE0ODY1MzQsImV4cCI6MTU4MTQ5MDIxNSwianRpIjoiOTcwODQzYjAtMWRhMy00ZTI2LTg5MTktNDJmNWYzZTMyMWNjIn0.BkP67iZ8_EzZygBG2L1e1rclmnTIs-1K36uR51HLBG0';

      const userAuthProvider = createPopupUserAuthProvider(
        mediaClient.stargate,
        {
          authProvider: () =>
            Promise.resolve({
              asapIssuer: 'mediaTest',
              token: jwtToken,
              baseUrl: 'some-api-url',
            }),
        },
      );

      const auth = await userAuthProvider();

      expect(mediaClient.stargate.fetchToken).toHaveBeenCalledWith(
        'client-id-from-asap',
      );
      expect(auth.token).toEqual('some-token-from-smart-edge');
    });

    it('created authProvider does not request token if a valid token is available', async () => {
      const userAuthProvider = createPopupUserAuthProvider(
        mediaClient.stargate,
        mediaClient.config,
      );

      await userAuthProvider();
      await userAuthProvider();

      expect(mediaClient.stargate.fetchToken).toBeCalledTimes(1);
    });

    it('created authProvider requests new token when token available is expired', async () => {
      const userAuthProvider = createPopupUserAuthProvider(
        mediaClient.stargate,
        mediaClient.config,
      );

      (mediaClient.stargate.isTokenExpired as jest.Mock).mockReturnValue(true);

      await userAuthProvider();
      await userAuthProvider();

      expect(mediaClient.stargate.fetchToken).toBeCalledTimes(2);
    });

    it('uses userAuthProvider when provided in the config', async () => {
      const configuredUserAuthProvider = jest.fn().mockResolvedValue({
        clientId: 'some-client-id',
        token: 'some-token',
        baseUrl: 'some-api-url',
      });
      const client = fakeMediaClient({
        authProvider: () =>
          Promise.resolve({
            clientId: tenantClientId,
            token: '',
            baseUrl: 'some-api-url',
          }),
        userAuthProvider: configuredUserAuthProvider,
      });

      const userAuthProvider = createPopupUserAuthProvider(
        client.stargate,
        client.config,
      );

      const auth = await userAuthProvider();

      expect(configuredUserAuthProvider).toHaveBeenCalled();
      expect(auth.token).toEqual('some-token');
    });

    it('returns error when stargate call fails', async () => {
      const userAuthProvider = createPopupUserAuthProvider(
        mediaClient.stargate,
        mediaClient.config,
      );

      (mediaClient.stargate.fetchToken as jest.Mock).mockRejectedValue({});

      return expect(userAuthProvider()).rejects.toThrow();
    });
  });
});
