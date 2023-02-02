jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    __esModule: true,
    ...actualModule,
    isPreviewableType: jest.fn(() => 'isPreviewableType-return'),
    isPreviewableFileState: jest.fn(() => 'isPreviewableFileState-return'),
  };
});
import { FileStatus } from '@atlaskit/media-client';
import { getCardStatus, isFinalCardStatus } from '../../getCardStatus';
import { FilePreviewStatus, CardStatus } from '../../../types';

const defaultOptions: FilePreviewStatus = {
  hasFilesize: true,
  hasPreview: false,
  isSupportedByBrowser: false,
  isPreviewable: true,
};

describe.each([true, false])('getCardStatus()', (fetchFileStateAfterUpload) => {
  it.each([`processing`, `error`, `failed-processing`, `uploading`] as const)(
    `should return the file status based on fileState if is %s when FF is ${fetchFileStateAfterUpload}`,
    (status) => {
      expect(
        getCardStatus(status, defaultOptions, { fetchFileStateAfterUpload }),
      ).toEqual(status);
    },
  );

  it(`should return 'complete' if the file status is 'processed' and file is not previewable when FF is ${fetchFileStateAfterUpload}`, () => {
    expect(
      getCardStatus(
        'processed',
        { ...defaultOptions, isPreviewable: false },
        { fetchFileStateAfterUpload },
      ),
    ).toEqual('complete');
  });

  it(`should return "complete" if the file status is "processed" and file has no preview when FF is ${fetchFileStateAfterUpload}`, () => {
    expect(
      getCardStatus(
        'processed',
        { ...defaultOptions, hasPreview: false },
        { fetchFileStateAfterUpload },
      ),
    ).toEqual('complete');
  });

  it(`should return "loading-preview" if the file status is "processed" and file is previewable with preview when FF is ${fetchFileStateAfterUpload}`, () => {
    expect(
      getCardStatus(
        'processed',
        { ...defaultOptions, hasPreview: true },
        { fetchFileStateAfterUpload },
      ),
    ).toEqual('loading-preview');
  });

  it(`should return loading by default when FF is ${fetchFileStateAfterUpload}`, () => {
    // forcing types to ensure the internal logic does not rely on
    // a known file status or the options object
    expect(
      getCardStatus(
        'unhandled-file-status' as FileStatus,
        {} as FilePreviewStatus,
      ),
    ).toEqual('loading');
  });
});

describe('getCardStatus() FF Off', () => {
  const featureFlags = { fetchFileStateAfterUpload: false };
  it('should return `complete` if the non-empty file status is `processing` and preview is disabled', () => {
    expect(
      getCardStatus(
        'processing',
        {
          isPreviewable: false,
          hasFilesize: true,
        } as FilePreviewStatus,
        featureFlags,
      ),
    ).toEqual('complete');
  });

  it('should return `complete` if the non-empty file status is `processing` and file state has preview', () => {
    expect(
      getCardStatus(
        'processing',
        {
          hasPreview: true,
          hasFilesize: true,
        } as FilePreviewStatus,
        featureFlags,
      ),
    ).toEqual('complete');
  });

  it('should return `processing` if the empty file status is `processing`', () => {
    expect(
      getCardStatus(
        'processing',
        {
          hasFilesize: false,
        } as FilePreviewStatus,
        featureFlags,
      ),
    ).toEqual('processing');
  });
});

describe('isFinalCardStatus', () => {
  const isFinal: Record<CardStatus, boolean> = {
    complete: true,
    error: true,
    'failed-processing': true,
    uploading: false,
    loading: false,
    processing: false,
    'loading-preview': false,
  };

  it.each(Object.entries(isFinal))(
    'when status is %s should return %s',

    (status, test) => {
      expect(isFinalCardStatus(status as CardStatus)).toBe(test);
    },
  );
});
