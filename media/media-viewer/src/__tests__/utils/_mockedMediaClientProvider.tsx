import React from 'react';
import type { MediaApi } from '@atlaskit/media-client';
import {
  isUploadingFileState,
  type MediaStore as MediaApiImpl,
  MediaClient,
  type ResponseFileItem,
  type UploadingFileState,
} from '@atlaskit/media-client';
import {
  createEmptyFileItem,
  createErrorFileState,
  createFileState,
  type CreateMockedMediaApiResult,
  createProcessingFileItem,
  createUploadingFileState,
  type SetItems,
  createMockedMediaApi,
} from '@atlaskit/media-client/test-helpers';
import { type MediaStore, type Store, createMediaStore } from '@atlaskit/media-state';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';

export const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return blob;
};

type ComponentWithChildren = React.ComponentType<{ children: React.ReactNode }>;

const createSubscribeFileItem = ({
  mediaApi,
  mediaStore,
}: {
  mediaApi: Partial<MediaApi>;
  mediaStore?: MediaStore;
}) => {
  const mediaClient = new MediaClient(
    {
      authProvider: async () => {
        return {
          clientId: 'MockedMediaClientProvider-uploader-client-id',
          token: 'MockedMediaClientProvider-uploader-token',
          baseUrl: 'MockedMediaClientProvider-uploader-service-host',
        };
      },
    },
    mediaStore,
    mediaApi as MediaApiImpl,
  );

  return (fileId: string, collectionName?: string) => {
    mediaClient.file.getFileState(fileId, { collectionName });
  };
};

export interface GetLocalPreviewHelper {
  (fileId: string): UploadingFileState['preview'];
}

interface CreateGetLocalPreviewHelper {
  (mediaStore: MediaStore): GetLocalPreviewHelper;
}

const createGetLocalPreviewHelper: CreateGetLocalPreviewHelper =
  (mediaStore) => (fileId) => {
    const fileState = mediaStore.getState().files[fileId];
    return isUploadingFileState(fileState) ? fileState.preview : undefined;
  };

export interface UploadHelper {
  (
    fileItem: ResponseFileItem,
    progress: number | 'error',
    binary?: Blob | string,
  ): void;
}

interface CreateUploadHelper {
  (params: {
    mediaStore: MediaStore;
    setItems: SetItems;
    subscribeToFileState: (fileId: string, collectionName?: string) => void;
  }): UploadHelper;
}

const createUploadHelper: CreateUploadHelper =
  ({ setItems, mediaStore, subscribeToFileState }) =>
  (fileItem, progress, binary) => {
    if (progress === 'error') {
      mediaStore.setState((state) => {
        state.files[fileItem.id] = createErrorFileState(fileItem);
      });
    } else if (progress === 1) {
      // Complete Upload
      const uploadedFileItem = createProcessingFileItem(fileItem, 0);
      setItems(uploadedFileItem);
      // TODO: This set state is probaly unneeded
      mediaStore.setState((state) => {
        state.files[fileItem.id] = createFileState(uploadedFileItem);
      });

      // A subscription to file state is required after the upload is complete to start polling from the mocked backend
      // TODO: This subscription is removing the local preview from the store
      subscribeToFileState(fileItem.id, fileItem.collection);
    } else {
      setItems(createEmptyFileItem(fileItem.id, fileItem.collection));

      const localBinary =
        typeof binary === 'string' ? dataURItoBlob(binary) : binary;

      const uploadingFileState = createUploadingFileState(
        fileItem,
        progress,
        localBinary,
      );
      mediaStore.setState((state) => {
        state.files[fileItem.id] = uploadingFileState;
      });
    }
  };

export interface ProcessHelper {
  (fileItem: ResponseFileItem, progress: number): void;
}

interface CreateProcessHelper {
  (params: { setItems: SetItems }): ProcessHelper;
}

const createProcessHelper: CreateProcessHelper =
  ({ setItems }) =>
  (fileItem, progress) => {
    setItems(createProcessingFileItem(fileItem, progress));
  };

interface CreateMockedMediaClientProviderWithApi {
  (params: {
    mediaApi: Partial<MediaApi>;
    mediaStore?: MediaStore;
  }): ComponentWithChildren;
}

const createMockedMediaClientProviderWithApi: CreateMockedMediaClientProviderWithApi =

    ({ mediaApi, mediaStore }) =>
    ({ children }: { children: React.ReactNode }) =>
      (
        <MockedMediaClientProvider
          mediaStore={mediaStore}
          mockedMediaApi={mediaApi}
        >
          {children}
        </MockedMediaClientProvider>
      );

export interface CreateMockedMediaClientProviderResult
  extends CreateMockedMediaApiResult {
  mediaStore: MediaStore;
  uploadItem: UploadHelper;
  processItem: ProcessHelper;
  getLocalPreview: GetLocalPreviewHelper;
  MockedMediaClientProvider: ComponentWithChildren;
}

export interface CreateMockedMediaClientProvider {
  (params: {
    initialStore?: Store;
    initialItems?: ResponseFileItem | ResponseFileItem[];
  }): CreateMockedMediaClientProviderResult;
}

export const createMockedMediaClientProvider: CreateMockedMediaClientProvider =
  ({ initialStore, initialItems }) => {
    const mediaStore = createMediaStore(initialStore);
    const { mediaApi, setItems, getItem } = createMockedMediaApi(initialItems);
    const subscribeToFileState = createSubscribeFileItem({
      mediaStore,
      mediaApi,
    });

    const uploadItem = createUploadHelper({
      setItems,
      mediaStore,
      subscribeToFileState,
    });

    const processItem = createProcessHelper({ setItems });

    const getLocalPreview = createGetLocalPreviewHelper(mediaStore);

    const MockedMediaClientProvider = createMockedMediaClientProviderWithApi({
      mediaStore,
      mediaApi,
    });

    return {
      mediaApi,
      mediaStore,
      setItems,
      getItem,
      uploadItem,
      processItem,
      getLocalPreview,
      MockedMediaClientProvider,
    };
  };
