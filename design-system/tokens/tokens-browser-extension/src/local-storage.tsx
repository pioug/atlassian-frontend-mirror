const TEST_KEY = '__storage_test__';

function LocalStorageFacade() {
  function isSupported() {
    try {
      window.localStorage.setItem(TEST_KEY, TEST_KEY);
      window.localStorage.removeItem(TEST_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  function setItem(key: string, value: string) {
    if (!isSupported()) {
      return;
    }

    window.localStorage.setItem(key, value);
  }

  function getItem<T extends string>(key: string): T | null {
    if (!isSupported()) {
      return null;
    }
    return window.localStorage.getItem(key) as T;
  }

  function removeItem(key: string) {
    if (!isSupported()) {
      return null;
    }
    return window.localStorage.removeItem(key);
  }

  return {
    isSupported,
    getItem,
    setItem,
    removeItem,
  };
}

export default LocalStorageFacade();
