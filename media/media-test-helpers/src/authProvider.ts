import { Auth, AuthProvider, AuthContext } from '@atlaskit/media-core';
import { defaultCollectionName } from './collectionNames';

const cachedAuths: { [key: string]: Promise<Auth> } = {};
const authProviderBaseURL =
  'https://api-private.dev.atlassian.com/media-playground/api';

export class StoryBookAuthProvider {
  static create(
    isAsapEnvironment: boolean,
    access?: { [resourceUrn: string]: string[] },
  ): AuthProvider {
    const loadTenatAuth = async (collectionName: string): Promise<Auth> => {
      const environment = isAsapEnvironment ? 'asap' : '';
      const headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      headers.append('Accept', 'text/plain, */*; q=0.01');
      const config: RequestInit = {
        method: 'POST',
        credentials: 'include',
        headers,
        body: access ? JSON.stringify({ access }) : undefined,
      };
      const url = `${authProviderBaseURL}/token/tenant?collection=${collectionName}&environment=${environment}`;
      const response = fetch(url, config);

      // We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
      return (await (await response).json()) as Auth;
    };

    return (authContext?: AuthContext): Promise<Auth> => {
      const collectionName =
        (authContext && authContext.collectionName) || defaultCollectionName;
      const accessStr = access ? JSON.stringify(access) : '';
      const cacheKey = `${collectionName}-${accessStr}-${isAsapEnvironment}`;

      if (!cachedAuths[cacheKey]) {
        cachedAuths[cacheKey] = loadTenatAuth(collectionName);
      }
      return cachedAuths[cacheKey];
    };
  }
}
