import { useEffect, useMemo, useState } from 'react';

import { StorageClient } from '../../storage/storage-client';

export const useLocalStorage = <T extends unknown>(
  key: string,
  defaultValue: T,
): [value: T, setValue: (value: T) => void] => {
  const storageClient = useMemo(() => new StorageClient(key), [key]);

  const [value, setValue] = useState<T>(
    () => storageClient.getItem(key) ?? defaultValue,
  );

  useEffect(() => {
    const loadedValue = (storageClient.getItem(key) as T) ?? undefined;
    if (loadedValue !== undefined) {
      setValue(loadedValue);
    }
  }, [key, storageClient]);

  useEffect(() => {
    storageClient.setItemWithExpiry(key, value);
  }, [key, storageClient, value]);

  return [value, setValue];
};
