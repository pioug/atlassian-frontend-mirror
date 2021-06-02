import { MediaClient } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';
import { StoryBookAuthProvider } from './authProvider';
import { collectionNames } from './collectionNames';
import { mediaPickerAuthProvider } from './mediaPickerAuthProvider';
import { userAuthProvider } from './userAuthProvider';

export const defaultBaseUrl = 'https://media.dev.atl-paas.net';

export const defaultParams = {
  clientId: '5a9812fc-d029-4a39-8a46-d3cc36eed7ab',
  asapIssuer: 'micros/media-playground',
  baseUrl: defaultBaseUrl,
};

interface AuthParameter {
  authType: 'client' | 'asap';
}

const defaultAuthParameter: AuthParameter = {
  authType: 'client',
};

/**
 * Creates and returns `MediaClient` (from `media-client`) based on the data provided in parameter object.
 *
 * @param {AuthParameter} authParameter specifies serviceName and whatever auth should be done with clientId or asapIssuer
 * @returns {Context}
 */
export const createStorybookMediaClient = (
  authParameter: AuthParameter = defaultAuthParameter,
): MediaClient => {
  return new MediaClient(createStorybookMediaClientConfig(authParameter));
};

export const createStorybookMediaClientConfig = (
  authParameter: AuthParameter = defaultAuthParameter,
): MediaClientConfig => {
  const scopes: { [resource: string]: string[] } = {
    'urn:filestore:file:*': ['read'],
    'urn:filestore:chunk:*': ['read'],
  };
  collectionNames.forEach((c) => {
    scopes[`urn:filestore:collection:${c}`] = ['read', 'update'];
  });

  const isAsapEnvironment = authParameter.authType === 'asap';
  const authProvider = StoryBookAuthProvider.create(isAsapEnvironment, scopes);
  return { authProvider };
};

export const createUploadMediaClient = () =>
  new MediaClient(createUploadMediaClientConfig());

export const createUploadMediaClientConfig = (
  stargateBaseUrl?: string,
): MediaClientConfig => ({
  authProvider: mediaPickerAuthProvider('asap'),
  stargateBaseUrl,
  userAuthProvider: stargateBaseUrl ? undefined : userAuthProvider,
});
