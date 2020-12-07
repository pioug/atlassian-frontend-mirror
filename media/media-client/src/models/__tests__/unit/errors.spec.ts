import {
  BaseMediaClientError,
  isFileFetcherError,
  FileFetcherErrorReason,
  FileFetcherError,
  isMediaStoreError,
  MediaStoreErrorReason,
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
      const fileFetcherError = new FileFetcherError(
        FileFetcherErrorReason.invalidFileId,
        'some-id',
      );
      expect(isFileFetcherError(fileFetcherError)).toBeTruthy();
    });

    it('should return the right arguments', () => {
      const fileFetcherError = new FileFetcherError(
        FileFetcherErrorReason.invalidFileId,
        'id',
        { collectionName: 'collectionName', occurrenceKey: 'occurrenceKey' },
      );
      expect(fileFetcherError.attributes).toMatchObject({
        reason: FileFetcherErrorReason.invalidFileId,
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
      const mediaStoreError = new MediaStoreError(
        MediaStoreErrorReason.failedAuthProvider,
      );
      expect(isMediaStoreError(mediaStoreError)).toBeTruthy();
    });

    it('should return the right arguments', () => {
      const error = new Error('error');
      const mediaStoreError = new MediaStoreError(
        MediaStoreErrorReason.failedAuthProvider,
        error,
      );
      expect(mediaStoreError.attributes).toMatchObject({
        reason: MediaStoreErrorReason.failedAuthProvider,
        innerError: error,
      });
    });
  });
});
