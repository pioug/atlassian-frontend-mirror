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
import { getCardStatus } from '../../card/getCardStatus';
import { FilePreviewStatus } from '../../../types';

const defaultOptions: FilePreviewStatus = {
  hasFilesize: true,
  hasPreview: false,
  isSupportedByBrowser: false,
  isPreviewable: true,
};

describe('getCardStatus()', () => {
  it.each([`processing`, `error`, `failed-processing`, `uploading`] as const)(
    'should return the file status based on fileState if is %s',
    (status) => {
      expect(getCardStatus(status, defaultOptions)).toEqual(status);
    },
  );

  it('should return `complete` if the file status is `processed` and file is not previewable', () => {
    expect(
      getCardStatus('processed', { ...defaultOptions, isPreviewable: false }),
    ).toEqual('complete');
  });

  it('should return `complete` if the file status is `processed` and file has no preview', () => {
    expect(
      getCardStatus('processed', { ...defaultOptions, hasPreview: false }),
    ).toEqual('complete');
  });

  it('should return `loading-preview` if the file status is `processed` and file is previewable with preview', () => {
    expect(
      getCardStatus('processed', { ...defaultOptions, hasPreview: true }),
    ).toEqual('loading-preview');
  });

  it('should return `complete` if the non-empty file status is `processing` and preview is disabled', () => {
    expect(
      getCardStatus('processing', {
        isPreviewable: false,
        // File has to be non-empty
        // TODO: improve/remove this check https://product-fabric.atlassian.net/browse/BMPT-1247
        hasFilesize: true,
      } as FilePreviewStatus),
    ).toEqual('complete');
  });

  it('should return `complete` if the non-empty file status is `processing` and file state has preview', () => {
    expect(
      getCardStatus('processing', {
        hasPreview: true,
        // File has to be non-empty
        // TODO: improve/remove this check https://product-fabric.atlassian.net/browse/BMPT-1247
        hasFilesize: true,
      } as FilePreviewStatus),
    ).toEqual('complete');
  });

  it('should return `processing` if the empty file status is `processing`', () => {
    expect(
      getCardStatus('processing', {
        // TODO: improve/remove this check https://product-fabric.atlassian.net/browse/BMPT-1247
        hasFilesize: false,
      } as FilePreviewStatus),
    ).toEqual('processing');
  });

  it('should return loading by default', () => {
    // forcing types to ensure the internal logic does not rely on
    // a known file status or the options object
    expect(
      getCardStatus(
        'unhandled-file-status' as FileStatus,
        {} as FilePreviewStatus,
      ),
    ).toEqual('loading');
  });

  it('should return loading by default', () => {
    // forcing types to ensure the internal logic does not rely in
    // a known file status or the options object
    expect(
      getCardStatus(
        'unhandled-file-status' as FileStatus,
        {} as FilePreviewStatus,
      ),
    ).toEqual('loading');
  });
});
