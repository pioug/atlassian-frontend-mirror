import React, { useMemo } from 'react';

import { MediaClient, MediaClientConfig } from '@atlaskit/media-client';

export const MediaClientContext = React.createContext<MediaClient | undefined>(
  undefined,
);

interface MediaClientProviderProp {
  children: React.ReactNode;
  clientConfig: MediaClientConfig;
}

const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

const getMediaClient = (mediaClientConfig: MediaClientConfig): MediaClient => {
  let mediaClient: MediaClient | undefined =
    mediaClientsMap.get(mediaClientConfig);

  if (!mediaClient) {
    mediaClient = new MediaClient(mediaClientConfig);
    mediaClientsMap.set(mediaClientConfig, mediaClient);
  }
  return mediaClient;
};
export const MediaClientProvider = ({
  children,
  clientConfig,
}: MediaClientProviderProp) => {
  const mediaClient = useMemo(
    () => getMediaClient(clientConfig),
    [clientConfig],
  );
  return (
    <MediaClientContext.Provider value={mediaClient}>
      {children}
    </MediaClientContext.Provider>
  );
};

export const useMediaClient = () => {
  const mediaClient = React.useContext(MediaClientContext);
  if (!mediaClient) {
    throw new Error('No MediaClient set, use MediaClientProvider to set one');
  }
  return mediaClient;
};
