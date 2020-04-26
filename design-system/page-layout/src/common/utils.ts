import { DimensionNames, Dimensions } from '../common/types';

import { DIMENSIONS, PAGE_LAYOUT_LS_KEY } from './constants';
import safeLocalStorage from './safe-local-storage';

const emptyGridState: Dimensions = DIMENSIONS.reduce(
  (acc, currentValue) => ({ ...acc, [currentValue]: 0 }),
  {},
);

const mergeGridStateIntoStorage = (key: string, value: any) => {
  const storageValue = JSON.parse(
    safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}',
  );

  if (value !== null && typeof value === 'object') {
    storageValue[key] = { ...storageValue[key], ...value };
  } else {
    storageValue[key] = value;
  }

  safeLocalStorage().setItem(PAGE_LAYOUT_LS_KEY, JSON.stringify(storageValue));
};

const getGridStateFromStorage = (key: string) => {
  const storageValue = JSON.parse(
    safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}',
  );

  return storageValue[key];
};

const removeFromGridStateInStorage = (key: string, secondKey?: string) => {
  const storageValue = JSON.parse(
    safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}',
  );

  if (secondKey && storageValue[key]) {
    delete storageValue[key][secondKey];
  } else {
    delete storageValue[key];
  }

  safeLocalStorage().setItem(PAGE_LAYOUT_LS_KEY, JSON.stringify(storageValue));
};

const resolveDimension = (
  key: DimensionNames,
  dimension: number = 0,
  shouldPersist: boolean = false,
) => {
  if (shouldPersist) {
    const cachedGridState = getGridStateFromStorage('gridState');

    return cachedGridState &&
      Object.keys(cachedGridState).length > 0 &&
      cachedGridState[key]
      ? cachedGridState[key]
      : dimension;
  }

  return dimension;
};

export {
  emptyGridState,
  mergeGridStateIntoStorage,
  getGridStateFromStorage,
  removeFromGridStateInStorage,
  resolveDimension,
};
