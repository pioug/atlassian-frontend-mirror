import { of } from 'rxjs/observable/of';

import { MediaApiConfig, MediaClientConfig } from '@atlaskit/media-core';
import { MediaClient } from '@atlaskit/media-client';

import { asMock } from './jestHelpers';

export const getDefaultMediaClientConfig = (): MediaClientConfig => ({
  authProvider: jest.fn().mockReturnValue(
    Promise.resolve({
      clientId: 'some-client-id',
      token: 'some-token',
      baseUrl: 'some-service-host',
    }),
  ),
});

export const fakeMediaClient = (
  config: MediaClientConfig = getDefaultMediaClientConfig(),
): MediaClient => {
  if (jest && jest.genMockFromModule) {
    const {
      MediaClient: MockMediaClient,
      FileFetcherImpl,
      CollectionFetcher,
      MediaStore: MockMediaStore,
      StargateClient,
    } = jest.genMockFromModule('@atlaskit/media-client');
    const mediaClient = new MockMediaClient();

    const fileFetcher = new FileFetcherImpl();
    const collectionFetcher = new CollectionFetcher();
    const mockMediaStore = new MockMediaStore({
      authProvider: config.authProvider,
    } as MediaApiConfig);
    const stargateClient = new StargateClient();
    mediaClient.file = fileFetcher;
    mediaClient.collection = collectionFetcher;
    mediaClient.stargate = stargateClient;
    mediaClient.config = config; // <- deprecated
    mediaClient.mediaClientConfig = config;
    mediaClient.mediaStore = mockMediaStore;
    mediaClient.mediaStore.getItems = jest
      .fn()
      .mockResolvedValue({ data: { items: [] } });
    asMock(mediaClient.getImageUrl).mockResolvedValue('some-image-url');
    asMock(mediaClient.getImage).mockImplementation(mockMediaStore.getImage);
    asMock(mediaClient.collection.getItems).mockReturnValue(of([]));
    asMock(mediaClient.file.copyFile).mockReturnValue({ id: 'copied-file-id' });
    asMock(mediaClient.file.getCurrentState).mockReturnValue(
      Promise.resolve({
        id: 'file-id',
        status: 'processed',
        mediaType: 'image',
        name: 'file_name',
      }),
    );
    asMock(mediaClient.file.getFileState).mockImplementation(() => ({
      subscribe: jest.fn(),
    }));
    asMock(mediaClient.stargate.fetchToken).mockImplementation(() =>
      Promise.resolve({
        data: {
          clientId: 'some-client-id-from-smart-edge',
          token: 'some-token-from-smart-edge',
          baseUrl: 'some-base-url-from-smart-edge',
          expiresIn: 34000,
          iat: new Date().getTime() / 1000,
        },
      }),
    );
    return mediaClient;
  } else {
    return new MediaClient(config);
  }
};
