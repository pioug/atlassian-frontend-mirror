import { MediaProvider } from '@atlaskit/editor-core';
import { Auth, AuthContext, MediaClientConfig } from '@atlaskit/media-core';

import { createPromise } from '../cross-platform-promise';

const getMediaToken = (context?: AuthContext): Promise<Auth> =>
  createPromise(
    'getAuth',
    // if collectionName exists in media's AuthContext, pass it along
    // otherwise pass an empty string (note that undefined doesn't work well with native promises)
    context && context.collectionName ? context.collectionName : '',
  ).submit();

export async function createMediaProvider(): Promise<MediaProvider> {
  const mediaClientConfig: MediaClientConfig = {
    authProvider: (context?: AuthContext) => getMediaToken(context),
  };

  return Promise.resolve({
    uploadMediaClientConfig: mediaClientConfig,
    viewMediaClientConfig: mediaClientConfig,
    uploadParams: {
      collection: '', // initially empty, will be returned by upload-end event
    },
  });
}
