import React from 'react';
import { MediaClientConfig } from '@atlaskit/media-core';
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
): MediaClient => {
  let mediaClient: MediaClient | undefined = mediaClientsMap.get(
    mediaClientConfig,
  );

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

export type WithMediaClientConfigProps<P extends WithMediaClient> = Omit<
  P,
  'mediaClient'
> &
  WithMediaClientConfig;

export type WithMediaClientFunction = <P extends WithMediaClient>(
  Component: React.ComponentType<P>,
) => React.ComponentType<WithMediaClientConfigProps<P>>;

export const withMediaClient: WithMediaClientFunction = <
  P extends WithMediaClient
>(
  Component: React.ComponentType<P>,
) => {
  return class extends React.Component<WithMediaClientConfigProps<P>> {
    render() {
      // TODO MS-1552: clean up after we move mediaClientConfig into FileIdentifier
      const props = this.props;
      const { mediaClientConfig, identifier } = props;
      const isExternalIdentifier =
        identifier && identifier.mediaItemType === 'external-image';
      const mediaClient: MediaClient = isExternalIdentifier
        ? createEmptyMediaClient()
        : getMediaClient(mediaClientConfig);

      return <Component {...(props as any)} mediaClient={mediaClient} />;
    }
  };
};
