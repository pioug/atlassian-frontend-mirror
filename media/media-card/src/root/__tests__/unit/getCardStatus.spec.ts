import { FileState } from '@atlaskit/media-client';
import {
  getCardStatus,
  getCardStatusFromFileState,
} from '../../card/getCardStatus';
import { CardState, CardProps } from '../../..';

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

  it('should return error status if state has error', () => {
    const state = {
      error: new Error('some-error'),
      status: 'uploading',
    } as CardState;
    const props = {
      identifier: {
        mediaItemType: 'file',
      },
    } as CardProps;

    expect(getCardStatus(state, props)).toEqual('error');
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
