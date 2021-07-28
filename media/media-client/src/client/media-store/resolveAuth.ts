import { Auth, AuthContext, AuthProvider } from '@atlaskit/media-core';
import { MediaStoreError } from './error';

export const TOKEN_MINIMUM_LIFETIME = 10000; // 10 sec

export const resolveAuth = async (
  authProvider: AuthProvider,
  authContext?: AuthContext,
): Promise<Auth> => {
  let auth: Auth;
  try {
    auth = await authProvider(authContext);
  } catch (err) {
    throw new MediaStoreError('failedAuthProvider', err);
  }

  /*
    We added a token expiration check here in the past, and then we had to revert due to edge cases in the client that we can't control.
    Token expiration check in the frontend is a bad idea. Don't do it!
    More info:
    https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13080
    https://gist.github.com/timvisee/fcda9bbdff88d45cc9061606b4b923ca
  */

  return auth;
};

export const resolveInitialAuth = (auth?: Auth) => {
  if (!auth) {
    throw new MediaStoreError('missingInitialAuth');
  }
  return auth;
};
