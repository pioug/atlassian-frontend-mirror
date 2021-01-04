import {
  BaseMediaClientError,
  isFileFetcherError,
  FileFetcherError,
  isMediaStoreError,
  MediaStoreError,
} from '../../errors';

describe('Errors', () => {
  describe('BaseMediaClientError', () => {
    it('should be extensible', () => {
      class TestError extends BaseMediaClientError<Object> {
        constructor() {
          super('TestError');
        }

        get attributes() {
          return {};
        }
      }

      const testError = new TestError();
      expect(typeof Object.getPrototypeOf(testError).attributes).toBeTruthy();
    });
  });

  describe('FileFetcherError', () => {
    it('should be identifiable', () => {
      const unknownError = new Error('unknown error');
      expect(isFileFetcherError(unknownError)).toBeFalsy();
      const fileFetcherError = new FileFetcherError('invalidFileId', 'some-id');
      expect(isFileFetcherError(fileFetcherError)).toBeTruthy();
    });

    it('should return the right arguments', () => {
      const fileFetcherError = new FileFetcherError('invalidFileId', 'id', {
        collectionName: 'collectionName',
        occurrenceKey: 'occurrenceKey',
      });
      expect(fileFetcherError.attributes).toMatchObject({
        reason: 'invalidFileId',
        id: 'id',
        collectionName: 'collectionName',
        occurrenceKey: 'occurrenceKey',
      });
    });
  });

  describe('MediaStoreError', () => {
    it('should be identifiable', () => {
      const unknownError = new Error('unknown error');
      expect(isMediaStoreError(unknownError)).toBeFalsy();
      const mediaStoreError = new MediaStoreError('failedAuthProvider');
      expect(isMediaStoreError(mediaStoreError)).toBeTruthy();
    });

    it('should return the right arguments', () => {
      const error = new Error('error');
      const mediaStoreError = new MediaStoreError('failedAuthProvider', error);
      expect(mediaStoreError.attributes).toMatchObject({
        reason: 'failedAuthProvider',
        innerError: error,
      });
    });
  });
});
