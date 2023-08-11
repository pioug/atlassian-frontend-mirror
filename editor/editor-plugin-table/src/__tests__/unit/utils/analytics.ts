import { renderHook } from '@testing-library/react-hooks';

import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';

import {
  generateResizeFrameRatePayloads,
  reduceResizeFrameRateSamples,
  useMeasureFramerate,
} from '../../../plugins/table/utils/analytics';

describe('reduceResizeFrameRateSamples()', () => {
  it('should return the same array if it has only one element', () => {
    expect(reduceResizeFrameRateSamples([1])).toEqual([1]);
  });

  it('should return the first element and the average of the array if length > 1', () => {
    expect(reduceResizeFrameRateSamples([3, 2, 4, 6])).toEqual([3, 4]);
  });
});

describe('generateResizeFrameRatePayloads()', () => {
  it('should return an empty array if the array is empty', () => {
    expect(
      generateResizeFrameRatePayloads({
        docSize: 10,
        frameRateSamples: [],
        originalNode: { nodeSize: 5 } as any,
      }),
    ).toEqual([]);
  });

  it('should return an array of payloads with the correct attributes', () => {
    expect(
      generateResizeFrameRatePayloads({
        docSize: 10,
        frameRateSamples: [3, 2, 4, 6],
        originalNode: { nodeSize: 5 } as any,
      }),
    ).toEqual([
      {
        action: TABLE_ACTION.RESIZE_PERF_SAMPLING,
        actionSubject: ACTION_SUBJECT.TABLE,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          frameRate: 3,
          nodeSize: 5,
          docSize: 10,
          isInitialSample: true,
        },
      },
      {
        action: TABLE_ACTION.RESIZE_PERF_SAMPLING,
        actionSubject: ACTION_SUBJECT.TABLE,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          frameRate: 4,
          nodeSize: 5,
          docSize: 10,
          isInitialSample: false,
        },
      },
    ]);
  });
});

describe('useMeasureFramerate()', () => {
  jest.useFakeTimers('modern');

  it('should return the correct handlers', () => {
    const { result } = renderHook(() => useMeasureFramerate());
    const { startMeasure, endMeasure, countFrames } = result.current;

    expect(startMeasure).toBeInstanceOf(Function);
    expect(endMeasure).toBeInstanceOf(Function);
    expect(countFrames).toBeInstanceOf(Function);
  });

  it('should return the correct frame rate sample', async () => {
    const { result } = renderHook(() =>
      useMeasureFramerate({ minTimeMs: 0, minFrames: 0, sampleRateMs: 0 }),
    );

    const { startMeasure, endMeasure, countFrames } = result.current;
    jest.advanceTimersByTime(100);
    startMeasure();
    jest.advanceTimersByTime(100);
    countFrames();
    const samples = endMeasure();

    expect(samples).toEqual([10]);

    jest.useRealTimers();
  });
});
