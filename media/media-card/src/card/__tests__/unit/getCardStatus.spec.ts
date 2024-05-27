jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    __esModule: true,
    ...actualModule,
    isPreviewableType: jest.fn(() => 'isPreviewableType-return'),
    isPreviewableFileState: jest.fn(() => 'isPreviewableFileState-return'),
  };
});
import { type FileStatus } from '@atlaskit/media-client';
import { getCardStatus, isFinalCardStatus } from '../../getCardStatus';
import { type FilePreviewStatus, type CardStatus } from '../../../types';

const defaultOptions: FilePreviewStatus = {
  hasFilesize: true,
  hasPreview: false,
  isSupportedByBrowser: false,
  isPreviewable: true,
};

describe('getCardStatus()', () => {
  it.each([`processing`, `error`, `failed-processing`, `uploading`] as const)(
    `should return the file status based on fileState if is %s`,
    (status) => {
      expect(getCardStatus(status, defaultOptions)).toEqual(status);
    },
  );

  it(`should return 'complete' if the file status is 'processed' and file is not previewable`, () => {
    expect(
      getCardStatus('processed', { ...defaultOptions, isPreviewable: false }),
    ).toEqual('complete');
  });

  it(`should return "complete" if the file status is "processed" and file has no preview`, () => {
    expect(
      getCardStatus('processed', { ...defaultOptions, hasPreview: false }),
    ).toEqual('complete');
  });

  it(`should return "loading-preview" if the file status is "processed" and file is previewable with preview`, () => {
    expect(
      getCardStatus('processed', { ...defaultOptions, hasPreview: true }),
    ).toEqual('loading-preview');
  });

  it(`should return loading by default`, () => {
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
