import { StorageClient } from '@atlaskit/frontend-utilities';

export const LOCAL_STORAGE_CLIENT_KEY = '@atlaskit/editor-plugin-card';
export const LOCAL_STORAGE_DISCOVERED_KEY = 'discovered';

const storageClient = new StorageClient(LOCAL_STORAGE_CLIENT_KEY);

export const isLocalStorageKeyDiscovered = (key: string) => {
  const localStorageValue = storageClient.getItem(key);
  return (
    !!localStorageValue && localStorageValue === LOCAL_STORAGE_DISCOVERED_KEY
  );
};

export const markLocalStorageKeyDiscovered = (
  key: string,
  expiration?: number,
) => {
  storageClient.setItemWithExpiry(
    key,
    LOCAL_STORAGE_DISCOVERED_KEY,
    expiration,
  );
};
