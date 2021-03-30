import { FileStatus } from '@atlaskit/media-client';
import { getCardStatus, GetCardStatusParams } from '../../card/getCardStatus';

const defaultOptions: GetCardStatusParams = {
  isPreviewableType: true,
  hasFilesize: true,
  isPreviewableFileState: false,
};

describe('getCardStatus()', () => {
  it.each([`processing`, `error`, `failed-processing`, `uploading`] as const)(
    'should return the file status based on fileState if is %s',
    status => {
      expect(getCardStatus(status, defaultOptions)).toEqual(status);
    },
  );

  it('should return `complete` if the file status is `processed`', () => {
    expect(getCardStatus('processed', defaultOptions)).toEqual('complete');
  });

  it('should return `complete` if the non-empty file status is `processing` and preview is disabled', () => {
    expect(
      getCardStatus('processing', {
        isPreviewableType: false,
        // File has to be non-empty
        // TODO: improve/remove this check https://product-fabric.atlassian.net/browse/BMPT-1247
        hasFilesize: true,
      } as GetCardStatusParams),
    ).toEqual('complete');
  });

  it('should return `complete` if the non-empty file status is `processing` and file state has preview', () => {
    expect(
      getCardStatus('processing', {
        isPreviewableFileState: true,
        // File has to be non-empty
        // TODO: improve/remove this check https://product-fabric.atlassian.net/browse/BMPT-1247
        hasFilesize: true,
      } as GetCardStatusParams),
    ).toEqual('complete');
  });

  it('should return `processing` if the empty file status is `processing`', () => {
    expect(
      getCardStatus('processing', {
        // TODO: improve/remove this check https://product-fabric.atlassian.net/browse/BMPT-1247
        hasFilesize: false,
      } as GetCardStatusParams),
    ).toEqual('processing');
  });

  it('should return loading by default', () => {
    // forcing types to ensure the internal logic does not rely on
    // a known file status or the options object
    expect(
      getCardStatus(
        'unhandled-file-status' as FileStatus,
        {} as GetCardStatusParams,
      ),
    ).toEqual('loading');
  });
});
