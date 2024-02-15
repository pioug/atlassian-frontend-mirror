import { Store, MediaStore } from '@atlaskit/media-state';
// TODO: these types should be exported from here (the public package), and imported in test-data
import { Binaries, ItemWithBinaries } from '@atlaskit/media-test-data';

import { MediaApi } from '@atlaskit/media-client';
import { GetItem as GetItemBase } from '@atlaskit/media-client/test-helpers';
import {
  createMockedMediaClientProvider,
  UploadHelper as UploadHelperBase,
  ProcessHelper as ProcessHelperBase,
  GetLocalPreviewHelper,
} from './_MockedMediaClientProvider';
import { dataURItoBlob, normaliseInput } from './_helpers';

interface SetItems {
  (itemsWithBinaries?: ItemWithBinaries | ItemWithBinaries[]): void;
}
interface SetBinaries {
  (id: string, binaries: Binaries): void;
}

interface GetItem {
  (id: string): ItemWithBinaries | undefined;
}

type ComponentWithChildren = React.ComponentType<{ children: React.ReactNode }>;

interface UploadHelper {
  (itemWithBinaries: ItemWithBinaries, progress: number | 'error'): void;
}

interface CreateUploadHelper {
  (params: {
    uploadHelperBase: UploadHelperBase;
    setBinaries: SetBinaries;
  }): UploadHelper;
}

const createUploadHelper: CreateUploadHelper =
  ({ setBinaries, uploadHelperBase }) =>
  ({ fileItem, binaryUri, image }, progress) => {
    uploadHelperBase(fileItem, progress, dataURItoBlob(binaryUri));
    setBinaries(fileItem.id, { binaryUri, image });
  };

interface ProcessHelper {
  (itemWithBinaries: ItemWithBinaries, progress: number): void;
}

interface CreateProcessHelper {
  (params: {
    processHelperBase: ProcessHelperBase;
    setBinaries: SetBinaries;
  }): ProcessHelper;
}

const createProcessHelper: CreateProcessHelper =
  ({ processHelperBase, setBinaries }) =>
  ({ fileItem, binaryUri, image }, progress) => {
    processHelperBase(fileItem, progress);
    setBinaries(fileItem.id, { binaryUri, image });
  };

export interface CreateMockedMediaClientProviderWithBinariesResult {
  mediaStore: MediaStore;
  mediaApi: MediaApi;
  MockedMediaClientProvider: ComponentWithChildren;
  setItems: SetItems;
  getItem: GetItem;
  uploadItem: UploadHelper;
  processItem: ProcessHelper;
  getLocalPreview: GetLocalPreviewHelper;
}

export interface CreateMockedMediaClientProviderWithBinaries {
  (params: {
    initialStore?: Store;
    initialItemsWithBinaries?: ItemWithBinaries | ItemWithBinaries[];
  }): CreateMockedMediaClientProviderWithBinariesResult;
}

const extendMediaApiWithBinaries = (
  mediaApi: MediaApi,
  getItemBase: GetItemBase,
  getItemBinaries: GetItem,
) => {
  const baseMediaApi = { ...mediaApi };

  mediaApi.getFileImageURL = async (fileId, ...args) => {
    const baseResult = baseMediaApi.getFileImageURL(fileId, ...args);
    const { image } = getItemBinaries(fileId) || {};
    return image ? image : baseResult;
  };

  mediaApi.getFileImageURLSync = (fileId, ...args) => {
    const baseResult = baseMediaApi.getFileImageURLSync(fileId, ...args);
    const { image } = getItemBinaries(fileId) || {};
    return image ? image : baseResult;
  };

  mediaApi.getFileBinaryURL = async (id, ...args) => {
    const baseResult = await baseMediaApi.getFileBinaryURL(id, ...args);
    const baseItem = getItemBase(id);

    // File is still uploading:
    if (baseItem?.details.size === 0) {
      // TODO: Check error type returned by backend when the file is still uploading
      return 'https://binary-not-found';
    }

    const { binaryUri } = getItemBinaries(id) || {};
    return binaryUri || baseResult;
  };

  mediaApi.getImage = async (fileId, ...args) => {
    const baseResult = await baseMediaApi.getImage(fileId, ...args);
    const { image } = getItemBinaries(fileId) || {};
    return image ? dataURItoBlob(image) : baseResult;
  };
};

export const createMockedMediaClientProviderWithBinaries: CreateMockedMediaClientProviderWithBinaries =
  ({ initialStore, initialItemsWithBinaries }) => {
    // Binaries store for each item
    const itemBinaries = new Map<string, Binaries>();

    const setBinaries = (id: string, binaries: Binaries) => {
      itemBinaries.set(id, binaries);
    };

    // Base Media Api and Provider
    const {
      mediaApi,
      mediaStore,
      getItem: getItemBase,
      setItems: setItemsBase,
      uploadItem: uploadHelperBase,
      processItem: processHelperBase,
      getLocalPreview,
      MockedMediaClientProvider,
    } = createMockedMediaClientProvider({ initialStore });

    // Wrappers for set, get, upload, process

    const setItems: SetItems = (items) => {
      const normalised = normaliseInput(items);
      normalised.map(({ fileItem, binaryUri, image }) =>
        itemBinaries.set(fileItem.id, { binaryUri, image }),
      );
      setItemsBase(normalised.map(({ fileItem }) => fileItem));
    };

    const getItem: GetItem = (id: string) => {
      const binaries = itemBinaries.get(id);
      const fileItem = getItemBase(id);
      if (binaries && fileItem) {
        return { fileItem, ...binaries };
      }
    };

    const uploadItem: UploadHelper = createUploadHelper({
      uploadHelperBase,
      setBinaries,
    });

    const processItem = createProcessHelper({ processHelperBase, setBinaries });

    // Add custom methods to return provided binaries from the endpoints
    // WARNING: Mutates the mediaApi object
    extendMediaApiWithBinaries(mediaApi, getItemBase, getItem);

    // Add the initial items to the storage
    setItems(initialItemsWithBinaries);

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
