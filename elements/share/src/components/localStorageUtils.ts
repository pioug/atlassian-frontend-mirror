import { ProductName } from '../types';

const getLocalStorageKey = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return null;
};

const updateLocalStorageKey = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export const getDefaultSlackWorkSpace = (product: ProductName) => {
  const key = `defaultSlackWorkspace-${product}`;

  return getLocalStorageKey(key);
};

export const setDefaultSlackWorkSpace = (
  product: ProductName,
  value: string,
) => {
  const key = `defaultSlackWorkspace-${product}`;

  return updateLocalStorageKey(key, value);
};

export const getIsOnboardingDismissed = (product: ProductName) => {
  const key = `isSlackOnboardingDismissedKey-${product}`;

  return getLocalStorageKey(key);
};

export const setIsOnboardingDismissed = (
  product: ProductName,
  value: string,
) => {
  const key = `isSlackOnboardingDismissedKey-${product}`;

  return updateLocalStorageKey(key, value);
};
