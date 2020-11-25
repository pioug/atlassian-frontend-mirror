import { MediaProvider } from '@atlaskit/editor-core';
import { MediaClientConfig } from '@atlaskit/media-core';
import { tenantAuthProvider } from '../../../__tests__/integration-webview/_mocks/database';

export const createMediaProvider = async (): Promise<MediaProvider> => {
  const mediaClientConfig: MediaClientConfig = {
    authProvider: tenantAuthProvider,
  };
  return Promise.resolve({
    uploadMediaClientConfig: mediaClientConfig,
    viewMediaClientConfig: mediaClientConfig,
    uploadParams: {
      collection: '', // initially empty, will be returned by upload-end event
    },
  });
};
