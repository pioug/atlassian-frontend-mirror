// window.localStorage is easier to mock in tests if wrapped in this module
export const getLocalMediaFeatureFlag = (key: string) => {
  try {
    return typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem(key)
      : null;
  } catch (e) {
    // do nothing, return null by default
  }
  return null;
};
