jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    __esModule: true,
    ...actualModule,
    isPreviewableType: jest.fn(() => 'isPreviewableType-return'),
    isPreviewableFileState: jest.fn(() => 'isPreviewableFileState-return'),
  };
});
import {
  FileStatus,
  FileState,
  isPreviewableType,
  isPreviewableFileState,
  MediaType,
} from '@atlaskit/media-client';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import {
  getCardStatus,
  GetCardStatusParams,
  extractCardStatusParams,
} from '../../card/getCardStatus';

const defaultOptions: GetCardStatusParams = {
  isPreviewableType: true,
  hasFilesize: true,
  isPreviewableFileState: false,
};

describe('getCardStatus()', () => {
  it.each([`processing`, `error`, `failed-processing`, `uploading`] as const)(
    'should return the file status based on fileState if is %s',
    (status) => {
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

describe('extractCardStatusParams()', () => {
  const dummyFeatureFlags = {} as MediaFeatureFlags;

  it('should check if a local preview is available and the media type is listed as previewable', () => {
    const dummyMediaType = 'some-mediaType' as MediaType;
    const dummyFileStateWithMediaType = {
      mediaType: dummyMediaType,
    } as FileState;
    expect(
      extractCardStatusParams(dummyFileStateWithMediaType, dummyFeatureFlags),
    ).toMatchObject(
      expect.objectContaining({
        isPreviewableType: isPreviewableType(dummyMediaType),
        isPreviewableFileState: isPreviewableFileState(
          dummyFileStateWithMediaType,
        ),
      }),
    );
    // Common helpers should be used for this operation
    expect(isPreviewableType).toBeCalledWith(dummyMediaType, dummyFeatureFlags);
    expect(isPreviewableFileState).toBeCalledWith(dummyFileStateWithMediaType);
  });

  it(`should use file state's file size`, () => {
    const dummyFileStateWithoutSize = ({
      size: undefined,
    } as unknown) as FileState;
    const dummyFileStateWithSize = ({
      size: 1,
    } as unknown) as FileState;

    expect(
      extractCardStatusParams(dummyFileStateWithoutSize, dummyFeatureFlags),
    ).toMatchObject(
      expect.objectContaining({
        hasFilesize: false,
      }),
    );

    expect(
      extractCardStatusParams(dummyFileStateWithSize, dummyFeatureFlags),
    ).toMatchObject(
      expect.objectContaining({
        hasFilesize: true,
      }),
    );
  });

  it('should return loading by default', () => {
    // forcing types to ensure the internal logic does not rely in
    // a known file status or the options object
    expect(
      getCardStatus(
        'unhandled-file-status' as FileStatus,
        {} as GetCardStatusParams,
      ),
    ).toEqual('loading');
  });
});
