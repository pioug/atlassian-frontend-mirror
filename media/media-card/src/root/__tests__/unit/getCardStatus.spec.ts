import { FileState } from '@atlaskit/media-client';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import {
  getCardStatus,
  getCardStatusFromFileState,
  completeCardProgress,
  updateCardStatusFromFileState,
} from '../../card/getCardStatus';
import { CardState, CardStatus, CardProps } from '../../..';
import {
  getAnalyticsLoadingStatus,
  AnalyticsLoadingStatusArgs,
} from '../../../utils/analytics';
import {
  PROCESSING_UPLOAD_PORTION,
  createProcessingProgressTimer,
  clearProcessingProgressTimer,
} from '../../../utils/processingProgress';

jest.mock('../../../utils/processingProgress', () => ({
  PROCESSING_UPLOAD_PORTION: 0.5,
  createProcessingProgressTimer: jest.fn(),
  clearProcessingProgressTimer: jest.fn(),
}));

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

  it("should return `uploading` if the file status is `processing` and file  isn't supported by browser", () => {
    expect(
      getCardStatusFromFileState({
        id: '123',
        status: 'processing',
        name: 'video.3gp',
        size: 10,
        mediaType: 'video',
        mimeType: 'video/3gp',
      }),
    ).toEqual('uploading');
  });

  it('should return `complete` if the file status is `processing` and file is supported by browser', () => {
    expect(
      getCardStatusFromFileState({
        id: '123',
        status: 'processing',
        name: 'image.jpg',
        size: 10,
        mediaType: 'image',
        mimeType: 'image/jpeg',
      }),
    ).toEqual('complete');
  });
});

describe('updateCardStatusFromFileState()', () => {
  const setup = (): {
    status: CardStatus;
    updateProgressMock: jest.Mock;
    lastStatus: CardStatus;
    lastProgress: number;
    lastTimer: number;
  } => {
    asMockFunction(createProcessingProgressTimer).mockClear();
    asMockFunction(clearProcessingProgressTimer).mockClear();

    return {
      status: 'complete',
      updateProgressMock: jest.fn(),
      lastStatus: 'uploading',
      lastProgress: 0.6,
      lastTimer: 1,
    };
  };

  describe('completeCardProgress()', () => {
    it('should call completeCardProgress() callback with 1 if lastProgress < 1', () => {
      const { status, updateProgressMock } = setup();
      completeCardProgress(status, updateProgressMock, {
        lastStatus: status,
        lastProgress: 0.5,
      });
      expect(updateProgressMock).toHaveBeenCalledTimes(1);
      expect(updateProgressMock).toHaveBeenCalledWith(status, 1);
    });

    it('should call completeCardProgress() callback with 1 if status !== lastStatus', () => {
      const { updateProgressMock } = setup();
      completeCardProgress('complete', updateProgressMock, {
        lastStatus: 'uploading',
        lastProgress: 1,
      });
      expect(updateProgressMock).toHaveBeenCalledTimes(1);
      expect(updateProgressMock).toHaveBeenCalledWith('complete', 1);
    });

    it("shouldn't call completeCardProgress() callback with 1 if lastProgress === 1 and statuses are same", () => {
      const { updateProgressMock } = setup();
      completeCardProgress('complete', updateProgressMock, {
        lastStatus: 'complete',
        lastProgress: 1,
      });
      expect(updateProgressMock).not.toHaveBeenCalled();
    });

    it('should clear last timer if passed', () => {
      const { lastTimer, updateProgressMock } = setup();
      completeCardProgress('complete', updateProgressMock, {
        lastStatus: 'complete',
        lastProgress: 1,
        lastTimer,
      });
      expect(clearProcessingProgressTimer).toHaveBeenCalledTimes(1);
      expect(clearProcessingProgressTimer).toHaveBeenCalledWith(lastTimer);
    });
  });

  const shouldRestartProgressTimer = (
    status: CardStatus,
    updateProgressMock: jest.Mock,
    lastProgress?: number,
    lastTimer?: number,
  ) => {
    expect(createProcessingProgressTimer).toHaveBeenCalledTimes(1);
    expect(createProcessingProgressTimer).toHaveBeenCalledWith(
      status,
      updateProgressMock,
      { lastProgress, lastTimer },
    );
  };

  const shouldCompleteProgressTimer = (
    status: CardStatus,
    updateProgressMock: jest.Mock,
    lastTimer?: number,
  ) => {
    if (lastTimer) {
      expect(clearProcessingProgressTimer).toHaveBeenCalledTimes(1);
      expect(clearProcessingProgressTimer).toHaveBeenCalledWith(lastTimer);
    }

    expect(updateProgressMock).toHaveBeenCalledTimes(1);
    expect(updateProgressMock).toHaveBeenCalledWith(status, 1);
  };

  it('uploading file state: should send matching progress value if supported by browser', () => {
    const { updateProgressMock } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'uploading',
      name: 'image.jpg',
      size: 10,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    const status: CardStatus = 'uploading';

    updateCardStatusFromFileState(fileState, status, updateProgressMock);

    expect(updateProgressMock).toHaveBeenCalledTimes(1);
    expect(updateProgressMock).toHaveBeenCalledWith(status, fileState.progress);
  });

  it('uploading file state: should send progress value * PROCESSING_UPLOAD_PORTION if not supported by browser', () => {
    const { updateProgressMock } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'uploading',
      name: 'video.3gp',
      size: 10,
      progress: 0.5,
      mediaType: 'video',
      mimeType: 'video/3gp',
    };
    const status: CardStatus = 'uploading';

    updateCardStatusFromFileState(fileState, status, updateProgressMock);

    expect(updateProgressMock).toHaveBeenCalledTimes(1);
    expect(updateProgressMock).toHaveBeenCalledWith(
      status,
      fileState.progress * PROCESSING_UPLOAD_PORTION,
    );
  });

  it('processing file state: should complete progress timer for supported files', () => {
    const { updateProgressMock, lastStatus, lastProgress, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'processing',
      name: 'image.jpg',
      size: 10,
      mediaType: 'image',
      mimeType: 'image/jpeg',
    };
    const status: CardStatus = 'complete';

    updateCardStatusFromFileState(fileState, status, updateProgressMock, {
      lastStatus,
      lastProgress,
      lastTimer,
    });
    shouldCompleteProgressTimer(status, updateProgressMock, lastTimer);
  });

  it('processing file state: should restart progress timer for non-supported files', () => {
    const { updateProgressMock, lastStatus, lastProgress, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'processing',
      name: 'video.3gp',
      size: 10,
      mediaType: 'video',
      mimeType: 'video/3gp',
    };
    const status: CardStatus = 'uploading';

    updateCardStatusFromFileState(fileState, status, updateProgressMock, {
      lastStatus,
      lastProgress,
      lastTimer,
    });
    shouldRestartProgressTimer(
      status,
      updateProgressMock,
      lastProgress,
      lastTimer,
    );
  });

  it('processed file state: should complete progress timer', () => {
    const { updateProgressMock, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'processed',
      name: 'image.jpg',
      size: 10,
      mediaType: 'image',
      mimeType: 'image/jpeg',
      artifacts: {},
      representations: {},
    };
    const status: CardStatus = 'complete';

    updateCardStatusFromFileState(fileState, status, updateProgressMock, {
      lastTimer,
    });
    shouldCompleteProgressTimer(status, updateProgressMock, lastTimer);
  });

  it('failed-processing file state: should complete progress timer', () => {
    const { updateProgressMock, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'failed-processing',
      name: 'image.jpg',
      size: 10,
      mediaType: 'image',
      mimeType: 'image/jpeg',
      artifacts: {},
    };
    const status: CardStatus = 'failed-processing';

    updateCardStatusFromFileState(fileState, status, updateProgressMock, {
      lastTimer,
    });
    shouldCompleteProgressTimer(status, updateProgressMock, lastTimer);
  });

  it('errored file state: should complete progress timer', () => {
    const { updateProgressMock, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'error',
      message: 'An error has occured',
    };
    const status: CardStatus = 'error';

    updateCardStatusFromFileState(fileState, status, updateProgressMock, {
      lastTimer,
    });
    shouldCompleteProgressTimer(status, updateProgressMock, lastTimer);
  });
});
