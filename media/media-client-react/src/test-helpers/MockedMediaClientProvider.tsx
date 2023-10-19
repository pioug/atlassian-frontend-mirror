import React, { useMemo } from 'react';

import { MediaClient, MediaStore } from '@atlaskit/media-client';
import { createMediaStore, Store } from '@atlaskit/media-state';

import { MediaClientContext } from '../MediaClientProvider';

export interface MockedMediaClientProviderProps {
  children: React.ReactNode;
  mockedMediaApi: Partial<MediaStore>;
  initialStore?: Store;
}

export const MockedMediaClientProvider = ({
  children,
  initialStore,
  mockedMediaApi,
}: MockedMediaClientProviderProps) => {
  const mediaClient = useMemo(
    () =>
      new MediaClient(
        {
          authProvider: async () => {
            return {
              clientId: 'MockedMediaClientProvider-client-id',
              token: 'MockedMediaClientProvider-token',
              baseUrl: 'MockedMediaClientProvider-service-host',
            };
          },
        },
        createMediaStore(initialStore),
        mockedMediaApi as MediaStore,
      ),
    [mockedMediaApi, initialStore],
  );

  return (
    <MediaClientContext.Provider value={mediaClient}>
      {children}
    </MediaClientContext.Provider>
  );
};
