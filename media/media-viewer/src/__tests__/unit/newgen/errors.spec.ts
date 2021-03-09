import {
  MediaClientError,
  MediaClientErrorReason,
} from '@atlaskit/media-client';
import {
  MediaViewerError,
  getErrorReason,
  getPrimaryErrorReason,
  getSecondaryErrorReason,
  getErrorDetail,
  MediaViewerErrorReason,
  ArchiveViewerErrorReason,
} from '../../../../src/newgen/errors';

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

  describe('General error reason', () => {
    it('should detect media-viewer primary reason from MediaViewerError', () => {
      expect(getErrorReason(MVError('docviewer-fetch-url'))).toEqual(
        'docviewer-fetch-url',
      );
    });

    it('should detect media-client primary error reason from MediaClientError', () => {
      expect(getErrorReason(MCError('invalidFileId'))).toEqual('invalidFileId');
    });

    it('should detect nativeError from native error', () => {
      expect(getErrorReason(new Error('some-error'))).toEqual('nativeError');
    });
  });

  describe('Primary error reason', () => {
    it('should detect media-viewer primary reason from MediaViewerError', () => {
      expect(getPrimaryErrorReason(MVError('docviewer-fetch-url'))).toEqual(
        'docviewer-fetch-url',
      );
    });

    it('should detect nativeError from native error', () => {
      expect(getPrimaryErrorReason(new Error('some-error'))).toEqual(
        'nativeError',
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

    it('should detect MediaViewerError reason from MediaViewerError with MediaViewerError secondary error', () => {
      expect(
        getSecondaryErrorReason(
          MVError('docviewer-fetch-url', MVError('audioviewer-playback')),
        ),
      ).toEqual('audioviewer-playback');
    });

    it('should detect media-client secondary error reason', () => {
      expect(getSecondaryErrorReason(MCError('invalidFileId'))).toEqual(
        'invalidFileId',
      );
    });

    it('should detect nativeError from native error', () => {
      expect(getSecondaryErrorReason(new Error('some-error'))).toEqual(
        'nativeError',
      );
    });
  });

  describe('Error Detail', () => {
    it('should detect error details for nativeError MediaViewEerrors', () => {
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
});
