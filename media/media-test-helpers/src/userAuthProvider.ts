import * as exenv from 'exenv';
import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaClient } from '@atlaskit/media-client';

export const userAuthProviderBaseURL = 'https://media.dev.atl-paas.net';

let userAuthProviderPromiseCache: Promise<ClientBasedAuth>;

export const userAuthProvider = (): Promise<ClientBasedAuth> => {
  if (!exenv.canUseDOM) {
    return Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: '',
    });
  }
  if (userAuthProviderPromiseCache) {
    return userAuthProviderPromiseCache;
  }

  const url =
    'https://media-playground.dev.atl-paas.net/api/token/user/impersonation';

  userAuthProviderPromiseCache = fetch(url, {
    method: 'GET',
  }).then((response) =>
    // We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
    response.json(),
  );
  return userAuthProviderPromiseCache;
};

export const createUserMediaClient = (): MediaClient => {
  return new MediaClient({
    authProvider: userAuthProvider,
  });
};
