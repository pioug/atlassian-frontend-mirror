import StorageClient from './main';

const CLIENT_KEY = 'storage_client';
const KEY = 'test_key';
const VALUE = { type: 'test' };

const captureExceptionHandler = jest.fn();

describe('storage-client', () => {
  beforeEach(() => {
    // to fully reset the state between tests, clear the storage
    localStorage.clear();

    // and reset all mocks
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('setItem is called', () => {
      new StorageClient(CLIENT_KEY, {
        handlers: { captureException: captureExceptionHandler },
      }).setItemWithExpiry(KEY, VALUE);

      expect(localStorage.setItem).toBeCalledTimes(1);
      expect(localStorage.setItem).toBeCalledWith(
        `${CLIENT_KEY}_${KEY}`,
        `{"value":{"type":"test"}}`,
      );
    });

    it('setItem is called and adds an expiry', () => {
      new StorageClient(CLIENT_KEY, {
        handlers: { captureException: captureExceptionHandler },
      }).setItemWithExpiry(KEY, VALUE, 1000 * 60 * 60);

      expect(localStorage.setItem).toBeCalledTimes(1);
      expect(localStorage.setItem).toBeCalledWith(
        `${CLIENT_KEY}_${KEY}`,
        `{"value":{"type":"test"},"expires":1502845200000}`,
      );
    });
  });

  describe('getItem', () => {
    it('getItem is called when a non-expired entry is returned', () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(
        '{"value":{"type":"test"},"expires":1502845200000}',
      );

      const response = new StorageClient(CLIENT_KEY, {
        handlers: { captureException: captureExceptionHandler },
      }).getItem(KEY);

      expect(localStorage.removeItem).toBeCalledTimes(0);
      expect(localStorage.getItem).toBeCalledTimes(1);
      expect(localStorage.getItem).toBeCalledWith(`${CLIENT_KEY}_${KEY}`);
      expect(response).toEqual(VALUE);
    });

    it('getItem and removeItem are called when an expired entry is returned', () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(
        '{"value":{"type":"test"},"expires":1502841500000}',
      );

      const response = new StorageClient(CLIENT_KEY, {
        handlers: { captureException: captureExceptionHandler },
      }).getItem(KEY);

      expect(localStorage.removeItem).toBeCalledTimes(0);
      expect(localStorage.getItem).toBeCalledTimes(1);
      expect(localStorage.getItem).toBeCalledWith(`${CLIENT_KEY}_${KEY}`);
      expect(response).toEqual(undefined);
    });

    it('getItem and removeItem are called, with an expired entry being returned', () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(
        '{"value":{"type":"test"},"expires":1502841500000}',
      );

      const response = new StorageClient(CLIENT_KEY, {
        handlers: { captureException: captureExceptionHandler },
      }).getItem(KEY, { useExpiredItem: true });

      expect(localStorage.removeItem).toBeCalledTimes(0);
      expect(localStorage.getItem).toBeCalledTimes(1);
      expect(localStorage.getItem).toBeCalledWith(`${CLIENT_KEY}_${KEY}`);
      expect(response).toEqual(VALUE);
    });
  });
});
