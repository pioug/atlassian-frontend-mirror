// Reliably test against conditions like
// localStorage being full or private mode in Safari being a .
// https://gist.github.com/paulirish/5558557
const isLocalStorageSupported = () => {
  try {
    // use an random key to test
    const testKey = `__test_${Date.now()}__`;
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    return true;
  } catch (e) {
    return false;
  }
};

declare var window: { __localStorageFallback: Storage };
const safeLocalStorage = () => {
  if (isLocalStorageSupported()) {
    return localStorage;
  }

  // Returning a mock object here in the case that this is run in SSR mode
  if (typeof window === 'undefined') {
    return {
      getItem: (_key: string) => null,
      setItem: (_key: string, _value: string) => null,
      removeItem: (_key: string) => null,
      clear: () => null,
      key: (_index: number) => null,
      get length() {
        return 0;
      },
    };
  }

  if (
    window.__localStorageFallback &&
    Object.keys(window.__localStorageFallback).length !== 0
  ) {
    return window.__localStorageFallback;
  }

  const storageAPI = {
    getItem: (key: string) => {
      if (window.__localStorageFallback.hasOwnProperty(key)) {
        return window.__localStorageFallback[key];
      }

      return null;
    },

    setItem: (key: string, value: string) => {
      window.__localStorageFallback[key] = String(value);
    },

    removeItem: (key: string) => {
      delete window.__localStorageFallback[key];
    },

    clear: (): void => {
      for (const key in window.__localStorageFallback) {
        if (window.__localStorageFallback.hasOwnProperty(key)) {
          delete window.__localStorageFallback[key];
        }
      }
    },

    get length() {
      if (!window.__localStorageFallback) {
        return 0;
      }

      return Object.keys(window.__localStorageFallback).length;
    },
  };

  window.__localStorageFallback = Object.create(storageAPI);

  return window.__localStorageFallback;
};

export default safeLocalStorage;
