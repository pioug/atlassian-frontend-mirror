import {
  isLocalStorageKeyDiscovered,
  markLocalStorageKeyDiscovered,
} from './local-storage';

describe('local-storage', () => {
  const TEST_LOCAL_STORAGE_KEY = 'some-random-key';
  const TEST_KEY_WITH_CLIENT =
    '@atlaskit/editor-plugin-card_' + TEST_LOCAL_STORAGE_KEY;

  beforeEach(() => {
    localStorage.clear();
  });

  describe('isLocalStorageKeyDiscovered', () => {
    const updateLocalStorage = (value: string, expires?: number) => {
      localStorage.setItem(
        TEST_KEY_WITH_CLIENT,
        JSON.stringify({
          value,
          expires,
        }),
      );
    };

    it('should return false for key that is not present in local storage', () => {
      expect(isLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY)).toBe(false);
    });

    it('should return false for key that is in present storage, but has value other than "discovered"', () => {
      updateLocalStorage('something random');
      expect(isLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY)).toBe(false);
    });

    it('should return false for a key that is in the storage and has an expired value of "discovered"', () => {
      updateLocalStorage('discovered', Date.now() - 1);
      expect(isLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY)).toBe(false);
    });

    it('should return true for a key that is in storage and has a value "discovered"', () => {
      updateLocalStorage('discovered');
      expect(isLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY)).toBe(true);
    });

    it('should return true for a key that is in the storage and has an unexpired value of "discovered"', () => {
      updateLocalStorage('discovered', Date.now() + 1);
      expect(isLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY)).toBe(true);
    });
  });

  describe('markLocalStorageKeyDiscovered', () => {
    it('should add a "discovered" value to the local store with no expiration', () => {
      markLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY);

      expect(localStorage.getItem(TEST_KEY_WITH_CLIENT)).toBe(
        JSON.stringify({ value: 'discovered' }),
      );
    });

    it('should add a "discovered" value with expiration when expiration is provided', () => {
      markLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY, 1000);

      const localStorageValue = localStorage.getItem(TEST_KEY_WITH_CLIENT);
      expect(localStorageValue).not.toBeNull();

      expect(JSON.parse(localStorageValue || '')).toMatchObject({
        value: 'discovered',
        expires: expect.any(Number),
      });
    });

    it('should override the existing key value when the same key is inserted again', () => {
      // first inserting a value with an expiry
      markLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY, 1000);

      const localStorageValue = localStorage.getItem(TEST_KEY_WITH_CLIENT);
      expect(localStorageValue).not.toBeNull();

      expect(JSON.parse(localStorageValue || '')).toMatchObject({
        value: 'discovered',
        expires: expect.any(Number),
      });

      // then inserting a value without expiry, local storage should be updated accordingly
      markLocalStorageKeyDiscovered(TEST_LOCAL_STORAGE_KEY);
      expect(localStorage.getItem(TEST_KEY_WITH_CLIENT)).toBe(
        JSON.stringify({ value: 'discovered' }),
      );
    });
  });
});
