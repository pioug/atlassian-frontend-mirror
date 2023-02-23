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

const NO_FLAGS = 'NO_FLAGS';
type SubMap = Map<MediaFeatureFlags | typeof NO_FLAGS, MediaClient>;
const mediaClientsMap = new Map<MediaClientConfig, SubMap>();

export const getMediaClient = (
  mediaClientConfig: MediaClientConfig,
  featureFlags?: MediaFeatureFlags,
): MediaClient => {
  const flagsMapKey = featureFlags || NO_FLAGS;
  let mediaClient: MediaClient | undefined = mediaClientsMap
    .get(mediaClientConfig)
    ?.get(flagsMapKey);

  if (!mediaClient) {
    let subMap = mediaClientsMap.get(mediaClientConfig);
    if (!subMap) {
      subMap = new Map();
      mediaClientsMap.set(mediaClientConfig, subMap);
    }
    mediaClient = new MediaClient(mediaClientConfig, featureFlags);
    subMap.set(flagsMapKey, mediaClient);
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
  P extends WithMediaClient,
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
