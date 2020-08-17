import { FileState } from '@atlaskit/media-client';
import {
  asMockFunction,
  asMockFunctionReturnValue,
} from '@atlaskit/media-test-helpers';
import {
  completeCardProgress,
  updateProgressFromFileState,
} from '../../card/getCardProgress';
import { CardStatus } from '../../..';
import {
  PROCESSING_UPLOAD_PORTION,
  shouldShowProcessingProgress,
  createProcessingProgressTimer,
  clearProcessingProgressTimer,
} from '../../../utils/processingProgress';

jest.mock('../../../utils/processingProgress', () => ({
  PROCESSING_UPLOAD_PORTION: 0.5,
  shouldShowProcessingProgress: jest.fn(),
  createProcessingProgressTimer: jest.fn(),
  clearProcessingProgressTimer: jest.fn(),
}));

describe('updateProgressFromFileState()', () => {
  const setup = (): {
    status: CardStatus;
    updateProgressMock: jest.Mock;
    lastStatus: CardStatus;
    lastProgress: number;
    lastTimer: number;
  } => {
    asMockFunction(shouldShowProcessingProgress).mockClear();
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
      expect(updateProgressMock).toHaveBeenCalledWith(1);
    });

    it('should call completeCardProgress() callback with 1 if status !== lastStatus', () => {
      const { updateProgressMock } = setup();
      completeCardProgress('complete', updateProgressMock, {
        lastStatus: 'uploading',
        lastProgress: 1,
      });
      expect(updateProgressMock).toHaveBeenCalledTimes(1);
      expect(updateProgressMock).toHaveBeenCalledWith(1);
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
    updateProgressMock: jest.Mock,
    fileState: FileState,
    lastProgress?: number,
    lastTimer?: number,
  ) => {
    expect(shouldShowProcessingProgress).toHaveBeenCalledTimes(1);
    expect(shouldShowProcessingProgress).toHaveBeenCalledWith(
      fileState,
      undefined,
    );

    expect(createProcessingProgressTimer).toHaveBeenCalledTimes(1);
    expect(
      createProcessingProgressTimer,
    ).toHaveBeenCalledWith(updateProgressMock, { lastProgress, lastTimer });
  };

  const shouldCompleteProgressTimer = (
    updateProgressMock: jest.Mock,
    lastTimer?: number,
  ) => {
    if (lastTimer) {
      expect(clearProcessingProgressTimer).toHaveBeenCalledTimes(1);
      expect(clearProcessingProgressTimer).toHaveBeenCalledWith(lastTimer);
    }

    expect(updateProgressMock).toHaveBeenCalledTimes(1);
    expect(updateProgressMock).toHaveBeenCalledWith(1);
  };

  it('uploading file state: should send matching progress value if shouldShowProcessingProgress=false', () => {
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

    asMockFunctionReturnValue(shouldShowProcessingProgress, false);

    updateProgressFromFileState(fileState, status, updateProgressMock);

    expect(shouldShowProcessingProgress).toHaveBeenCalledTimes(1);
    expect(shouldShowProcessingProgress).toHaveBeenCalledWith(
      fileState,
      undefined,
    );

    expect(updateProgressMock).toHaveBeenCalledTimes(1);
    expect(updateProgressMock).toHaveBeenCalledWith(fileState.progress);
  });

  it('uploading file state: should send progress value * PROCESSING_UPLOAD_PORTION if shouldShowProcessingProgress=true', () => {
    const { updateProgressMock } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'uploading',
      name: 'video.3gp',
      size: 10,
      progress: 0.5,
      mediaType: 'video',
      mimeType: 'video/3gpp',
    };
    const status: CardStatus = 'uploading';

    asMockFunctionReturnValue(shouldShowProcessingProgress, true);

    updateProgressFromFileState(fileState, status, updateProgressMock);

    expect(shouldShowProcessingProgress).toHaveBeenCalledTimes(1);
    expect(shouldShowProcessingProgress).toHaveBeenCalledWith(
      fileState,
      undefined,
    );

    expect(updateProgressMock).toHaveBeenCalledTimes(1);
    expect(updateProgressMock).toHaveBeenCalledWith(
      fileState.progress * PROCESSING_UPLOAD_PORTION,
    );
  });

  it('processing file state: should complete progress timer if shouldShowProcessingProgress=false', () => {
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

    asMockFunctionReturnValue(shouldShowProcessingProgress, false);

    updateProgressFromFileState(fileState, status, updateProgressMock, {
      lastStatus,
      lastProgress,
      lastTimer,
    });
    shouldCompleteProgressTimer(updateProgressMock, lastTimer);
  });

  it('processing file state: should restart progress timer if shouldShowProcessingProgress=true', () => {
    const { updateProgressMock, lastStatus, lastProgress, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'processing',
      name: 'video.3gp',
      size: 10,
      mediaType: 'video',
      mimeType: 'video/3gpp',
    };
    const status: CardStatus = 'uploading';

    asMockFunctionReturnValue(shouldShowProcessingProgress, true);

    updateProgressFromFileState(fileState, status, updateProgressMock, {
      lastStatus,
      lastProgress,
      lastTimer,
    });
    shouldRestartProgressTimer(
      updateProgressMock,
      fileState,
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

    updateProgressFromFileState(fileState, status, updateProgressMock, {
      lastTimer,
    });
    shouldCompleteProgressTimer(updateProgressMock, lastTimer);
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

    updateProgressFromFileState(fileState, status, updateProgressMock, {
      lastTimer,
    });
    shouldCompleteProgressTimer(updateProgressMock, lastTimer);
  });

  it('errored file state: should complete progress timer', () => {
    const { updateProgressMock, lastTimer } = setup();
    const fileState: FileState = {
      id: '123',
      status: 'error',
      message: 'An error has occured',
    };
    const status: CardStatus = 'error';

    updateProgressFromFileState(fileState, status, updateProgressMock, {
      lastTimer,
    });
    shouldCompleteProgressTimer(updateProgressMock, lastTimer);
  });
});
