import { StargateClient, EdgeData } from '@atlaskit/media-client';
import jwtDecode from 'jwt-decode';
import {
  Auth,
  AuthProvider,
  ClientBasedAuth,
  AuthContext,
  MediaClientConfig,
  isClientBasedAuth,
} from '@atlaskit/media-core';

interface JWTData {
  clientId: string;
  iat: number;
  exp: number;
}

const getAuthFromEdgeData = (response: EdgeData): ClientBasedAuth => ({
  clientId: response.data.clientId,
  token: response.data.token,
  baseUrl: response.data.baseUrl,
});

const getClientIdFromAuth = (auth: Auth): string => {
  if (isClientBasedAuth(auth)) {
    return auth.clientId;
  }
  const tokenData: JWTData = jwtDecode(auth.token);
  return tokenData.clientId;
};

export const createPopupUserAuthProvider = (
  stargate: StargateClient,
  mediaClientConfig: MediaClientConfig,
): AuthProvider => {
  let tokenData: EdgeData | undefined;

  return async (context?: AuthContext) => {
    const { userAuthProvider } = mediaClientConfig;
    if (userAuthProvider) {
      return userAuthProvider(context);
    }

    try {
      if (!tokenData || stargate.isTokenExpired(tokenData)) {
        const { authProvider } = mediaClientConfig;
        const clientId = getClientIdFromAuth(await authProvider(context));
        tokenData = await stargate.fetchToken(clientId);
      }

      return getAuthFromEdgeData(tokenData);
    } catch (e) {
      throw new Error(
        'Popup media picker Stargate call failed. If you were not intending to use Stargate you should provide userAuthProvider in the context',
      );
    }
  };
};
