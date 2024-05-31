import { StorageClient } from '@atlaskit/frontend-utilities';

export const LOCAL_STORAGE_CLIENT_KEY = '@atlaskit/editor-plugin-card';
export const LOCAL_STORAGE_DISCOVERED_KEY = 'discovered';
export const LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK = 'smart-link-upgrade-pulse';
export const LOCAL_STORAGE_DISCOVERY_KEY_TOOLBAR = 'toolbar-upgrade-pulse';
export const ONE_DAY_IN_MILLISECONDS = 86400000;

const storageClient = new StorageClient(LOCAL_STORAGE_CLIENT_KEY);

export const isLocalStorageKeyDiscovered = (key: string) => {
	const localStorageValue = storageClient.getItem(key);
	return !!localStorageValue && localStorageValue === LOCAL_STORAGE_DISCOVERED_KEY;
};

export const markLocalStorageKeyDiscovered = (key: string, expiration?: number) => {
	storageClient.setItemWithExpiry(key, LOCAL_STORAGE_DISCOVERED_KEY, expiration);
};
