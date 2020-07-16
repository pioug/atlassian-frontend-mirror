import {
  PROCESSING_UPLOAD_PORTION,
  PROCESSING_STEP,
  PROCESSING_MAX_VALUE,
  PROCESSING_TICK,
  createProcessingProgressTimer,
} from '../../processingProgress';
import { CardStatus } from '../../..';

describe('[create/clear]ProcessingProgressTimer()', () => {
  let timer: number;

  const setup = (
    opts: {
      lastProgress?: number;
      lastTimer?: number;
    } = {},
  ) => {
    const { lastProgress, lastTimer } = opts;
    const status: CardStatus = 'uploading';

    jest.useFakeTimers();

    const updateProgressMock = jest.fn();
    timer = createProcessingProgressTimer(status, updateProgressMock, {
      lastProgress,
      lastTimer,
    });

    return { status, updateProgressMock };
  };

  afterEach(() => !!timer && clearInterval(timer));
  afterAll(() => jest.useRealTimers());

  it('should call window.setInterval', () => {
    setup();
    expect(setInterval).toHaveBeenCalledTimes(1);
  });

  it('should clear previous timer if passed', () => {
    const lastTimer = 1;
    setup({ lastTimer });
    expect(clearInterval).toHaveBeenCalledWith(lastTimer);
  });

  it('should call updateProgress() callback each tick', () => {
    const { updateProgressMock } = setup();
    jest.advanceTimersByTime(PROCESSING_TICK * 3);
    expect(updateProgressMock).toHaveBeenCalledTimes(3);
  });

  it('should add PROCESSING_STEP to PROCESSING_UPLOAD_PORTION', () => {
    const { status, updateProgressMock } = setup();
    jest.advanceTimersByTime(PROCESSING_TICK * 2);

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      1,
      status,
      PROCESSING_UPLOAD_PORTION + PROCESSING_STEP,
    );

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      2,
      status,
      PROCESSING_UPLOAD_PORTION + PROCESSING_STEP + PROCESSING_STEP,
    );
  });

  it('should add PROCESSING_STEP to previous progress if passed', () => {
    const lastProgress = 0.4;
    const { status, updateProgressMock } = setup({
      lastProgress,
    });
    jest.advanceTimersByTime(PROCESSING_TICK * 2);

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      1,
      status,
      lastProgress + PROCESSING_STEP,
    );

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      2,
      status,
      lastProgress + PROCESSING_STEP + PROCESSING_STEP,
    );
  });

  it('should max at PROCESSING_MAX_VALUE', () => {
    const { status, updateProgressMock } = setup();
    jest.advanceTimersByTime(PROCESSING_TICK * 30);
    expect(updateProgressMock).toHaveBeenNthCalledWith(
      30,
      status,
      PROCESSING_MAX_VALUE,
    );
  });
});
