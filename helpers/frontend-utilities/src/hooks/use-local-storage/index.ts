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

export function useLocalStorageRecord<T>(
  key: string,
  initialValue: T[] = [],
  maxLength = 100,
) {
  const [records, setRecords] = useLocalStorage<T[]>(key, initialValue);

  const putRecord = (record: T) => {
    if (!records) {
      setRecords([record]);
      return;
    }
    //just to keep storage limited somehow
    if (maxLength > 0 && records.length > maxLength - 1) {
      records.shift();
    }
    if (
      records.find(elem => JSON.stringify(elem) === JSON.stringify(record)) ===
      undefined
    ) {
      setRecords([...records, record]);
    }
  };

  const removeRecord = (query: string) => {
    if (!records) {
      return;
    }
    const filtered = records.filter(
      elem => JSON.stringify(elem).indexOf(`"${query}"`) === -1,
    );
    setRecords(filtered);
  };
  const actions = {
    putRecord,
    removeRecord,
  };
  return { records, actions };
}
