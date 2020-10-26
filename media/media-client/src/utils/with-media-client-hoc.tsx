import React from 'react';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { MediaClient } from '../client/media-client';
import { Identifier } from '../identifier';

export interface WithMediaClientConfig {
  mediaClientConfig: MediaClientConfig;
}

export interface WithMediaClient {
  mediaClient: MediaClient;
  identifier?: Identifier;
}

const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

export const getMediaClient = (
  mediaClientConfig: MediaClientConfig,
  featureFlags?: MediaFeatureFlags,
): MediaClient => {
  let mediaClient: MediaClient | undefined = mediaClientsMap.get(
    mediaClientConfig,
  );

  if (!mediaClient) {
    mediaClient = new MediaClient(mediaClientConfig, featureFlags);
    mediaClientsMap.set(mediaClientConfig, mediaClient);
  }
  return mediaClient;
};

const createEmptyMediaClient = (
  featureFlags?: MediaFeatureFlags,
): MediaClient => {
  const emptyConfig: MediaClientConfig = {
    authProvider: () =>
      Promise.resolve({
        clientId: '',
        token: '',
        baseUrl: '',
      }),
  };

  return new MediaClient(emptyConfig, featureFlags);
};

export type WithMediaClientConfigProps<P extends WithMediaClient> = Omit<
  P,
  'mediaClient'
> &
  WithMediaClientConfig;

export type WithMediaClientFunction = <P extends WithMediaClient>(
  Component: React.ComponentType<P>,
  featureFlags?: MediaFeatureFlags,
) => React.ComponentType<WithMediaClientConfigProps<P>>;

export const withMediaClient: WithMediaClientFunction = <
  P extends WithMediaClient
>(
  Component: React.ComponentType<P>,
  featureFlags?: MediaFeatureFlags,
) => {
  return class extends React.Component<WithMediaClientConfigProps<P>> {
    render() {
      // TODO MPT-315: clean up after we move mediaClientConfig into FileIdentifier
      const { mediaClientConfig, ...otherProps } = this.props;
      const mediaClient: MediaClient = !mediaClientConfig
        ? createEmptyMediaClient(featureFlags)
        : getMediaClient(mediaClientConfig, featureFlags);

      return <Component {...(otherProps as any)} mediaClient={mediaClient} />;
    }
  };
};
