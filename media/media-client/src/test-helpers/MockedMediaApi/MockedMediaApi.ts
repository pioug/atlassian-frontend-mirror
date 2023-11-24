import { MediaApi, ResponseFileItem } from '../../client/media-store';
import { getMediaFile, normaliseInput } from './helpers';

export interface SetFileItems {
  (fileItems: ResponseFileItem | ResponseFileItem[]): void;
}
export interface GetFileItem {
  (id: string): ResponseFileItem | undefined;
}

export interface CreateMockedMediaApiResult {
  mediaApi: MediaApi;
  setFileItems: SetFileItems;
  getFileItem: GetFileItem;
}

const getMediaApi = ({
  getFileItem,
}: {
  setFileItems: SetFileItems;
  getFileItem: GetFileItem;
}): MediaApi => ({
  // --------------------------------------------------------
  // UPLOAD ENDPOINTS - None is supported
  // --------------------------------------------------------

  touchFiles: async ({ descriptors }) => {
    throw new Error('500 - MockedMediaApi.touchFiles: method not implemented');
  },

  probeChunks: async (...args) => {
    throw new Error('500 - MockedMediaApi.probeChunks: method not implemented');
  },

  uploadChunk: async (_etag, _blob, uploadId) => {
    throw new Error('500 - MockedMediaApi.uploadChunk: method not implemented');
  },

  appendChunksToUpload: async () => {
    throw new Error(
      '500 - MockedMediaApi.appendChunksToUpload: method not implemented',
    );
  },

  createFileFromUpload: async ({ uploadId }, { collection }) => {
    throw new Error(
      '500 - MockedMediaApi.createFileFromUpload: method not implemented',
    );
  },

  // Used by Media Picker as a fallback for conflicted file Ids
  createUpload: async () => {
    throw new Error(
      '500 - MockedMediaApi.createUpload: method not implemented',
    );
  },
  // For File size limits
  getRejectedResponseFromDescriptor: () => {
    throw new Error(
      '500 - MockedMediaApi.getRejectedResponseFromDescriptor: method not implemented',
    );
  },

  // --------------------------------------------------------
  // METADATA ENDPOINTS
  // --------------------------------------------------------

  getFile: async (fileId) => {
    const fileItem = getFileItem(fileId);
    if (!fileItem) {
      throw new Error('404 - MockedMediaApi.getFile: file not found');
    }
    return {
      data: getMediaFile(fileItem),
    };
  },
  getItems: async (ids) => {
    const items = ids
      .map((id) => getFileItem(id))
      .filter((fileState): fileState is ResponseFileItem => !!fileState);

    return { data: { items } };
  },
  // TODO
  getImageMetadata: async () => {
    throw new Error(
      '500 - MockedMediaApi.getImageMetadata: method not implemented',
    );
  },

  // --------------------------------------------------------
  // URL ENDPOINTS
  // --------------------------------------------------------

  // TODO
  getFileImageURL: async () => {
    throw new Error(
      '500 - MockedMediaApi.getFileImageURL: method not implemented',
    );
  },
  // TODO
  getFileImageURLSync: () => {
    throw new Error(
      '500 - MockedMediaApi.getFileImageURLSync: method not implemented',
    );
  },
  getFileBinaryURL: async (id) => {
    const fileItem = getFileItem(id);
    if (!fileItem) {
      throw new Error('404 - MockedMediaApi.getFileBinaryURL: file not found');
    }
    if (fileItem.details.size === 0) {
      // TODO veryify if this is the correct answer for an uploading file
      throw new Error('404 - MockedMediaApi.getFileBinaryURL: file is empty');
    }
    return `/file/${id}/binary`;
  },
  getArtifactURL: async (artifacts, artifactName) => {
    const artifactUrl = artifacts[artifactName]?.url;
    if (!artifactUrl) {
      throw new Error(
        `404 - MockedMediaApi.getArtifactURL: artifact ${artifactName} not found`,
      );
    }
    return artifactUrl;
  },

  // --------------------------------------------------------
  // BINARY ENDPOINTS
  // --------------------------------------------------------
  getImage: async (fileId) => {
    const fileItem = getFileItem(fileId);
    if (!fileItem) {
      throw new Error('404 - MockedMediaApi.getImage: file not found');
    }
    if (!fileItem.details.representations.image) {
      throw new Error('404 - MockedMediaApi.getImage: image not found');
    }

    // Empty Blob. Might have to change for a real one if TLR loads the image
    return new Blob();
  },

  // --------------------------------------------------------
  // OTHER ENDPOINTS
  // --------------------------------------------------------

  // TODO
  copyFileWithToken: async (body) => {
    const fileId = body.sourceFile.id;
    const fileItem = getFileItem(fileId);
    if (!fileItem) {
      throw new Error('404 - MockedMediaApi.copyFileWithToken: file not found');
    }
    return {
      data: getMediaFile(fileItem),
    };
  },

  // TODO
  removeCollectionFile: async () => {},

  // --------------------------------------------------------
  // OTHER ENDPOINTS
  // --------------------------------------------------------
  request: async () => new Response(),

  resolveAuth: async () => ({
    asapIssuer: '',
    token: '',
    baseUrl: '',
  }),
  resolveInitialAuth: () => ({
    asapIssuer: '',
    token: '',
    baseUrl: '',
  }),
});

/**
 * Mocked Media API
 */
export const createMockedMediaApi = (
  initialFileItems?: ResponseFileItem | ResponseFileItem[],
): CreateMockedMediaApiResult => {
  const storedFileItems = new Map<string, ResponseFileItem>();

  const getFileItem: GetFileItem = (fileId) => storedFileItems.get(fileId);

  const setFileItems: SetFileItems = (fileItems) => {
    const normalised = normaliseInput(fileItems);
    normalised.forEach((fileItem) =>
      storedFileItems.set(fileItem.id, fileItem),
    );
  };

  if (initialFileItems) {
    setFileItems(initialFileItems);
  }

  const mediaApi = getMediaApi({ setFileItems, getFileItem });

  return {
    setFileItems,
    getFileItem,
    mediaApi,
  };
};
