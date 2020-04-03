import { Auth, AuthContext, AuthProvider } from '@atlaskit/media-core';
import { userAuthProviderBaseURL } from './userAuthProvider';
import { defaultCollectionName } from './collectionNames';

const cachedAuths: { [key: string]: Promise<Auth> } = {};

type Access = { [resource: string]: string[] };
const accessUrns: { [key: string]: Access } = {
  MediaServicesSample: {
    'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
    'urn:filestore:chunk:*': ['create', 'read'],
    'urn:filestore:upload': ['create'],
    'urn:filestore:upload:*': ['read', 'update'],
    'urn:filestore:file': ['create'],
    'urn:filestore:file:*': ['read', 'update'],
  },
  'mediapicker-test': {
    'urn:filestore:collection': ['create'],
    'urn:filestore:collection:mediapicker-test': ['read', 'insert'],
    'urn:filestore:chunk:*': ['create', 'read'],
    'urn:filestore:upload': ['create'],
    'urn:filestore:upload:*': ['read', 'update'],
    'urn:filestore:file': ['create'],
    'urn:filestore:file:*': ['read', 'update'],
  },
};

const requestAuthProvider = async (
  authEnvironment: string,
  collectionName: string,
): Promise<Auth> => {
  const url = `https://api-private.dev.atlassian.com/media-playground/api/token/tenant?environment=${authEnvironment}`;
  const body = JSON.stringify({
    access: accessUrns[collectionName] || {},
  });
  const headers = new Headers();

  headers.append('Content-Type', 'application/json; charset=utf-8');
  headers.append('Accept', 'text/plain, */*; q=0.01');

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
    credentials: 'include',
  });

  // We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
  return response.json();
};

export const mediaPickerAuthProvider = (authEnvironment: string = 'asap') => (
  context?: AuthContext,
) => {
  const collectionName =
    (context && context.collectionName) || defaultCollectionName;
  authEnvironment = authEnvironment === 'asap' ? 'asap' : '';
  const cacheKey = `${collectionName}:${authEnvironment}`;

  if (!cachedAuths[cacheKey]) {
    cachedAuths[cacheKey] = requestAuthProvider(
      authEnvironment,
      collectionName,
    );
  }
  return cachedAuths[cacheKey];
};

export const defaultMediaPickerAuthProvider: AuthProvider = () => {
  const auth: Auth = {
    clientId: 'a89be2a1-f91f-485c-9962-a8fb25ccfa13',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhODliZTJhMS1mOTFmLTQ4NWMtOTk2Mi1hOGZiMjVjY2ZhMTMiLCJ1bnNhZmUiOnRydWUsImlhdCI6MTQ3MzIyNTEzNn0.6Isj5jKgKzWDnPqfoMLiC_LVIlGM8kg_wxG6eGGwhTw',
    baseUrl: userAuthProviderBaseURL,
  };

  return Promise.resolve(auth);
};
