import { FileState } from '@atlaskit/media-client';
import {
  getCardStatus,
  getAnalyticsErrorStateAttributes,
  getCardProgressFromFileState,
  getAnalyticsStatusFromCardStatus,
  getCardStatusFromFileState,
} from '../../card/getCardStatus';
import { CardState, CardProps } from '../../..';

describe('getCardStatus()', () => {
  describe('image files', () => {
    it('should keep existing status', () => {
      const state = {
        metadata: {
          mediaType: 'image',
        },
        status: 'uploading',
      } as CardState;
      const props = {
        identifier: {
          mediaItemType: 'file',
        },
      } as CardProps;

      expect(getCardStatus(state, props)).toEqual('uploading');
    });

    it('should fallback to processing if its complete and no preview is available', () => {
      const state = {
        metadata: {
          mediaType: 'image',
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

  describe('non image files', () => {
    it('should return complete status if enough metadata is already available', () => {
      const state = {
        metadata: {
          name: 'file',
          size: 1,
          mediaType: 'doc',
        },
        status: 'processing',
      } as CardState;
      const props = {
        identifier: {
          mediaItemType: 'file',
        },
      } as CardProps;

      expect(getCardStatus(state, props)).toEqual('complete');
    });

    it('should keep current status if identifier is not a file', () => {
      const state = {
        metadata: {
          name: 'file',
          size: 1,
          mediaType: 'doc',
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
});

describe('getAnalyticsErrorStateAttributes()', () => {
  it('should return an empty object if did NOT receive fileState and error', () => {
    expect(getAnalyticsErrorStateAttributes()).toEqual({});
  });

  it('should return a `media-client-error` object with error if did NOT receive fileState and receives error as string', () => {
    expect(getAnalyticsErrorStateAttributes(undefined, 'canceled')).toEqual({
      error: 'canceled',
      failReason: 'media-client-error',
    });
  });

  it('should return a `media-client-error` object with error if did NOT receive fileState and receives error as an instance of Error', () => {
    const error = new Error('oops');
    expect(getAnalyticsErrorStateAttributes(undefined, error)).toEqual({
      error: 'oops',
      failReason: 'media-client-error',
    });
  });

  it('should return a `file-status-error` with unknown error if did receive a fileStatus without message', () => {
    const fileStatus: FileState = {
      status: 'error',
      id: '123',
    };
    expect(getAnalyticsErrorStateAttributes(fileStatus)).toEqual({
      error: 'unknown error',
      failReason: 'file-status-error',
    });
  });

  it('should return a `file-status-error` with error message if did receive a fileStatus with message', () => {
    const fileStatus: FileState = {
      status: 'error',
      id: '123',
      message: 'some error occurred!',
    };
    expect(getAnalyticsErrorStateAttributes(fileStatus)).toEqual({
      error: 'some error occurred!',
      failReason: 'file-status-error',
    });
  });

  it('should return an empty object if receives a fileState which is not an `error` and `failed-processing`', () => {
    const fileStatus: FileState = {
      id: '123',
      status: 'processed',
      name: 'image.jpg',
      size: 10,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    expect(getAnalyticsErrorStateAttributes(fileStatus)).toEqual({});
  });
});

describe('getAnalyticsStatusFromCardStatus()', () => {
  it('should return `failed` if card status information is `error`', () => {
    expect(getAnalyticsStatusFromCardStatus('error')).toEqual('failed');
  });

  it('should return `failed` if card status information is `failed-processing`', () => {
    expect(getAnalyticsStatusFromCardStatus('failed-processing')).toEqual(
      'failed',
    );
  });

  it('should return `undefined` if card status information is NOT `failed-processing` and `error`', () => {
    expect(getAnalyticsStatusFromCardStatus('loading')).toBeUndefined();
    expect(getAnalyticsStatusFromCardStatus('uploading')).toBeUndefined();
    expect(getAnalyticsStatusFromCardStatus('processing')).toBeUndefined();
    expect(getAnalyticsStatusFromCardStatus('complete')).toBeUndefined();
  });
});

describe('getCardProgressFromFileState()', () => {
  it('should return progress value if file is still uploading', () => {
    const fileStatus: FileState = {
      id: '123',
      status: 'uploading',
      name: 'image.jpg',
      size: 10,
      progress: 1,
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    expect(getCardProgressFromFileState(fileStatus)).toEqual(1);
  });

  it('should return `undefined` value if file is processing and there is NO dataURI available', () => {
    const fileStatus: FileState = {
      id: '123',
      status: 'processing',
      name: 'image.jpg',
      size: 10,
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    expect(getCardProgressFromFileState(fileStatus)).toBeUndefined();
  });

  it('should return `undefined` value if file is NOT processing AND uploading', () => {
    const fileStatus: FileState = {
      id: '123',
      status: 'processing',
      name: 'image.jpg',
      size: 10,
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    expect(getCardProgressFromFileState(fileStatus)).toBeUndefined();
  });

  it('should return `undefined` value if file is processing and there is NO dataURI available', () => {
    const fileStatus: FileState = {
      status: 'error',
      id: '123',
    };
    expect(getCardProgressFromFileState(fileStatus)).toBeUndefined();
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

  it('should return `processing` if the file status is `processing` and file does not have dataURI information', () => {
    expect(
      getCardStatusFromFileState({
        status: 'processing',
        id: '123',
      } as FileState),
    ).toEqual('processing');
  });

  it('should return `complete` if the file status is `processing` and file contains dataURI information', () => {
    expect(
      getCardStatusFromFileState(
        {
          status: 'processing',
          id: '123',
        } as FileState,
        'dataURI-of-image.jpg',
      ),
    ).toEqual('complete');
  });
});
