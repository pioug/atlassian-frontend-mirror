import { FileState } from '@atlaskit/media-client';
import {
  getCardStatus,
  getCardStatusFromFileState,
} from '../../card/getCardStatus';
import { CardState, CardProps } from '../../..';
import {
  getAnalyticsLoadingStatus,
  AnalyticsLoadingStatusArgs,
} from '../../../utils/analytics';

describe('getCardStatus()', () => {
  it('should keep current status if identifier is not a file', () => {
    const state = {
      metadata: {
        name: 'file',
        size: 1,
        mediaType: 'image',
      },
      status: 'processing',
    } as CardState;
    const props = {
      identifier: {
        mediaItemType: 'external-image',
        dataURI: 'some-image',
      },
    } as CardProps;

    expect(getCardStatus(state, props)).toEqual('processing');
  });

  it('should return processing status if file has no size', () => {
    const state = {
      metadata: {
        name: 'file',
        size: 0,
        mediaType: 'unknown',
      },
      status: 'complete',
    } as CardState;
    const props = {
      identifier: {
        mediaItemType: 'file',
      },
    } as CardProps;

    expect(getCardStatus(state, props)).toEqual('processing');
  });
});

describe('getAnalyticsLoadingStatus', () => {
  it('should return undefined if did receive dataURI or any non-error card status', () => {
    const args: AnalyticsLoadingStatusArgs = {
      cardStatus: 'error',
      metadata: { id: 'some-id' },
      dataURI: 'some-data-uri',
    };
    expect(getAnalyticsLoadingStatus(args)).toBeUndefined();

    const noErrorArgs: AnalyticsLoadingStatusArgs = {
      cardStatus: 'processing',
      metadata: { id: 'some-id' },
      dataURI: 'some-data-uri',
    };
    expect(getAnalyticsLoadingStatus(noErrorArgs)).toBeUndefined();
  });

  it('should return a `media-client-error` if receives an error', () => {
    const args: AnalyticsLoadingStatusArgs = {
      cardStatus: 'error',
      metadata: { id: 'some-id' },
      error: new Error('some-error'),
    };
    expect(getAnalyticsLoadingStatus(args)).toEqual({
      action: 'failed',
      failReason: 'media-client-error',
      error: 'some-error',
    });
  });

  it('should return a `file-status-error` if cardStatus is failed-processing OR error', () => {
    const id = 'some-id';

    const errorFileState: FileState = {
      id,
      status: 'error',
      message: 'some-nice-message',
    };
    const errorArgs: AnalyticsLoadingStatusArgs = {
      cardStatus: errorFileState.status,
      metadata: { id },
      fileState: errorFileState,
    };
    expect(getAnalyticsLoadingStatus(errorArgs)).toEqual({
      action: 'failed',
      failReason: 'file-status-error',
      error: errorFileState.message,
    });

    const failedFileState: FileState = {
      id,
      name: 'image.jpg',
      size: 10,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/jpeg',
      status: 'failed-processing',
    };
    const failedArgs: AnalyticsLoadingStatusArgs = {
      cardStatus: failedFileState.status,
      metadata: { id, name: failedFileState.name },
      fileState: failedFileState,
    };
    expect(getAnalyticsLoadingStatus(failedArgs)).toEqual({
      action: 'failed',
      failReason: 'file-status-error',
      error: 'unknown error',
    });

    const failedArgsWithNoFileName = { ...failedArgs, metadata: { id, name } };
    expect(getAnalyticsLoadingStatus(failedArgsWithNoFileName)).toEqual({
      action: 'failed',
      failReason: 'file-status-error',
      error:
        'Does not have minimal metadata (filename and filesize) OR metadata/media-type is undefined',
    });
  });

  it('should return succeeded if card status is complete', () => {
    const id = 'some-id';
    const fileState: FileState = {
      id,
      name: 'image.jpg',
      size: 10,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/jpeg',
      status: 'processed',
    };
    const failedArgs: AnalyticsLoadingStatusArgs = {
      cardStatus: 'complete',
      metadata: { id, name: fileState.name },
      fileState: fileState,
    };
    expect(getAnalyticsLoadingStatus(failedArgs)).toEqual({
      action: 'succeeded',
    });
  });
});

describe('getCardStatusFromFileState()', () => {
  it('should return the file status based on fileState if is an `error`, `failed-processing` or `uploading`', () => {
    expect(
      getCardStatusFromFileState({
        status: 'error',
        id: '123',
      } as FileState),
    ).toEqual('error');
    expect(
      getCardStatusFromFileState({
        status: 'failed-processing',
        id: '123',
      } as FileState),
    ).toEqual('failed-processing');

    expect(
      getCardStatusFromFileState({
        status: 'uploading',
        id: '123',
      } as FileState),
    ).toEqual('uploading');
  });

  it('should return `complete` if the file status is `processed`', () => {
    expect(
      getCardStatusFromFileState({
        status: 'processed',
        id: '123',
      } as FileState),
    ).toEqual('complete');
  });

  it("should return `uploading` if the file status is `processing` and file isn't supported by browser", () => {
    expect(
      getCardStatusFromFileState({
        id: '123',
        status: 'processing',
        name: 'video.3gp',
        size: 10,
        mediaType: 'video',
        mimeType: 'video/3gpp',
      }),
    ).toEqual('uploading');
  });

  it('should return `uploading` if the file status is `processing` and file is supported but has no local preview', () => {
    expect(
      getCardStatusFromFileState({
        id: '123',
        status: 'processing',
        name: 'image.jpg',
        size: 10,
        mediaType: 'image',
        mimeType: 'image/jpeg',
      }),
    ).toEqual('uploading');
  });

  it('should return `complete` if the file status is `processing` and file is previewable in browser', () => {
    expect(
      getCardStatusFromFileState({
        id: '123',
        status: 'processing',
        name: 'image.jpg',
        size: 10,
        mediaType: 'image',
        mimeType: 'image/jpeg',
        preview: {
          value: new Blob([], { type: 'image/jpeg' }),
        },
      }),
    ).toEqual('complete');
  });
});
