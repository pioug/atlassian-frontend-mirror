import { Auth, AuthContext, AuthProvider } from '@atlaskit/media-core';
import { MediaStoreError } from './error';
import parseJwt from '../../utils/parseJwt';

export const TOKEN_MINIMUM_LIFETIME = 10000; // 10 sec

const hasExpiration = (jwt: unknown): jwt is { exp: number } =>
  jwt instanceof Object && 'exp' in jwt && typeof jwt['exp'] === 'number';

export default async (
  authProvider: AuthProvider,
  authContext?: AuthContext,
  now = Date.now(),
): Promise<Auth> => {
  let auth: Auth;
  try {
    auth = await authProvider(authContext);
  } catch (err) {
    throw new MediaStoreError('failedAuthProvider', err);
  }
  let tokenExpire = 0;
  try {
    const parsedJwt = parseJwt(auth.token);
    if (hasExpiration(parsedJwt)) {
      const { exp } = parsedJwt;
      // exp does not include miliseconds
      tokenExpire = exp * 1000;
    }
  } catch (e) {
    // if we fail to parse the token, the backend might have better luck
  }
  // If the token will expire within the next TOKEN_MINIMUM_LIFETIME [ms],
  // it is considered expired already, as it is presumed that won't make it to the
  // backend before it effectively expires.
  if (!!tokenExpire && tokenExpire - TOKEN_MINIMUM_LIFETIME <= now) {
    throw new MediaStoreError('tokenExpired');
  }
  return auth;
};
