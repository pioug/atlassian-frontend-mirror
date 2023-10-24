import React from 'react';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaClient } from '../client/media-client';
import { Identifier } from '../identifier';

/**
 * @deprecated This export will be removed. Please use one from `@atlaskit/media-client-react`
 */
export interface WithMediaClientConfig {
  mediaClientConfig: MediaClientConfig;
}

/**
 * @deprecated This export will be removed. Please use one from `@atlaskit/media-client-react`
 */
export interface WithMediaClient {
  mediaClient: MediaClient;
  identifier?: Identifier;
}

const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

/**
 * @deprecated This export will be removed. Please use one from `@atlaskit/media-client-react`
 */
export const getMediaClient = (
  mediaClientConfig: MediaClientConfig,
): MediaClient => {
  let mediaClient: MediaClient | undefined =
    mediaClientsMap.get(mediaClientConfig);

  if (!mediaClient) {
    mediaClient = new MediaClient(mediaClientConfig);
    mediaClientsMap.set(mediaClientConfig, mediaClient);
  }
  return mediaClient;
};

const createEmptyMediaClient = (): MediaClient => {
  const emptyConfig: MediaClientConfig = {
    authProvider: () =>
      Promise.resolve({
        clientId: '',
        token: '',
        baseUrl: '',
      }),
  };

  return new MediaClient(emptyConfig);
};

/**
 * @deprecated This export will be removed. Please use one from `@atlaskit/media-client-react`
 */
export type WithMediaClientConfigProps<P extends WithMediaClient> = Omit<
  P,
  'mediaClient'
> &
  WithMediaClientConfig;

/**
 * @deprecated This export will be removed. Please use one from `@atlaskit/media-client-react`
 */
export type WithMediaClientFunction = <P extends WithMediaClient>(
  Component: React.ComponentType<P>,
) => React.ComponentType<WithMediaClientConfigProps<P>>;

/**
 * @deprecated This export will be removed. Please use one from `@atlaskit/media-client-react`
 */
export const withMediaClient: WithMediaClientFunction = <
  P extends WithMediaClient,
>(
  Component: React.ComponentType<P>,
) => {
  return class extends React.Component<WithMediaClientConfigProps<P>> {
    render() {
      // TODO MPT-315: clean up after we move mediaClientConfig into FileIdentifier
      const { mediaClientConfig, ...otherProps } = this.props;
      const mediaClient: MediaClient = !mediaClientConfig
        ? createEmptyMediaClient()
        : getMediaClient(mediaClientConfig);

      return <Component {...(otherProps as any)} mediaClient={mediaClient} />;
    }
  };
};
