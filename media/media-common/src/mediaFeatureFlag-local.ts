// window.localStorage is easier to mock in tests if wrapped in this module
export const getLocalMediaFeatureFlag = (key: string) =>
  typeof window !== 'undefined' && window.localStorage
    ? window.localStorage.getItem(key)
    : null;
