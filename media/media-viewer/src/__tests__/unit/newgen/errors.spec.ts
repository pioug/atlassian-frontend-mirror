import {
  MediaClientError,
  MediaClientErrorReason,
  RequestError,
} from '@atlaskit/media-client';
import {
  MediaViewerError,
  getPrimaryErrorReason,
  getSecondaryErrorReason,
  getErrorDetail,
  getRequestMetadata,
  MediaViewerErrorReason,
  ArchiveViewerErrorReason,
} from '../../../../src/errors';

describe('Errors', () => {
  const MVError = (
    primaryErrorReason: MediaViewerErrorReason | ArchiveViewerErrorReason,
    secondaryError?: Error,
  ) => new MediaViewerError(primaryErrorReason, secondaryError);

  const MCError = (reason: MediaClientErrorReason) => {
    const error = new Error(reason) as any;
    error.attributes = { reason };
    return error as MediaClientError<any>;
  };

  describe('Primary error reason', () => {
    it('should detect media-viewer primary reason from MediaViewerError', () => {
      expect(getPrimaryErrorReason(MVError('docviewer-fetch-url'))).toEqual(
        'docviewer-fetch-url',
      );
    });
  });

  describe('Secondary error reason', () => {
    it('should detect nativeError reason from MediaViewerError with native secondary error', () => {
      expect(
        getSecondaryErrorReason(
          MVError('docviewer-fetch-url', new Error('some-error')),
        ),
      ).toEqual('nativeError');
    });

    it('should detect media-client secondary error reason', () => {
      expect(
        getSecondaryErrorReason(
          MVError('imageviewer-fetch-url', MCError('invalidFileId')),
        ),
      ).toEqual('invalidFileId');
    });

    it('should detect nativeError from native error', () => {
      expect(
        getSecondaryErrorReason(
          MVError('imageviewer-fetch-url', new Error('some-error')),
        ),
      ).toEqual('nativeError');
    });
  });

  describe('Error Detail', () => {
    it('should detect error details for nativeError MediaViewerErrors', () => {
      expect(
        getErrorDetail(
          MVError('imageviewer-fetch-url', new Error('some-error-message')),
        ),
      ).toBe('some-error-message');
    });

    it('should detect undefined for non-nativeError detail of MediaViewerErrors', () => {
      expect(getErrorDetail(MVError('imageviewer-fetch-url'))).toBeUndefined();
    });

    it('should detect undefined for non-nativeError detail', () => {
      expect(getErrorDetail(new Error('some-error'))).toBeUndefined();
    });
  });

  describe('Request metadata', () => {
    it('should detect request metadata for RequestError', () => {
      expect(
        getRequestMetadata(
          MVError(
            'imageviewer-fetch-url',
            new RequestError('serverForbidden', {
              method: 'GET',
              endpoint: '/some-endpoint',
            }),
          ),
        ),
      ).toStrictEqual({ method: 'GET', endpoint: '/some-endpoint' });
    });

    it('should detect undefined for non-nativeError detail of MediaViewerErrors', () => {
      expect(
        getRequestMetadata(MVError('imageviewer-fetch-url')),
      ).toBeUndefined();
    });

    it('should detect undefined for non-native errors', () => {
      expect(getRequestMetadata(new Error('some-error'))).toBeUndefined();
    });
  });
});
