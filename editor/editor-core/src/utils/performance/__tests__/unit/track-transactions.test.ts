import {
  startMeasure as startMeasureWithMark,
  stopMeasure as stopMeasureWithMark,
} from '@atlaskit/editor-common';
import { TransactionTracker } from '../../track-transactions';
import * as timingUtils from '../../get-performance-timing';

jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  isPerformanceAPIAvailable: () => true,
}));

describe('bumpDispatchCounter', () => {
  let tracker: TransactionTracker;

  const options = {
    enabled: true,
  };

  beforeEach(() => {
    tracker = new TransactionTracker();
  });

  it('should not increment if tracking is disabled', () => {
    expect(tracker.bumpDispatchCounter({ enabled: false })).toEqual(0);
  });

  it('should increment once per call if tracking is enabled', () => {
    // dispatchCallCounter is 0 at the start
    expect(tracker.bumpDispatchCounter(options)).toEqual(1);
    expect(tracker.bumpDispatchCounter(options)).toEqual(2);
  });

  it('should reset after default sampling rate of 100 is reached', () => {
    // dispatchCallCounter is 0 at the start
    for (let i = 0; i < 100; i++) {
      expect(tracker.bumpDispatchCounter(options)).toEqual(i + 1);
    }

    // dispatchCallCounter is now 0 again
    for (let i = 0; i < 100; i++) {
      expect(tracker.bumpDispatchCounter(options)).toEqual(i + 1);
    }
  });

  it('should reset after custom sampling rate is reached', () => {
    const options = {
      enabled: true,
      samplingRate: 5,
    };

    // dispatchCallCounter is 0 at the start
    for (let i = 0; i < 5; i++) {
      expect(tracker.bumpDispatchCounter(options)).toEqual(i + 1);
    }

    // dispatchCallCounter is now 0 again
    for (let i = 0; i < 5; i++) {
      expect(tracker.bumpDispatchCounter(options)).toEqual(i + 1);
    }
  });
});

describe('shouldTrackTransaction', () => {
  const options = {
    enabled: true,
  };

  it('should return true 4 times within the threshold of 5 when run 20 times', () => {
    const tracker = new TransactionTracker();
    const options = { enabled: true, samplingRate: 5 };

    // call to increment counter
    const results = new Array(20)
      .fill(false)
      .map(() => {
        tracker.bumpDispatchCounter(options);
        return tracker.shouldTrackTransaction(options);
      })
      .filter((bool) => bool);

    expect(results).toHaveLength(4);
  });

  it('should return false until default threshold of 100', () => {
    const tracker = new TransactionTracker();
    tracker.bumpDispatchCounter(options);
    expect(tracker.shouldTrackTransaction(options)).toBeFalsy();
  });

  it('should return true once within the default threshold of 100', () => {
    const tracker = new TransactionTracker();

    // call to increment counter
    const results = new Array(100)
      .fill(false)
      .map(() => {
        tracker.bumpDispatchCounter(options);
        return tracker.shouldTrackTransaction(options);
      })
      .filter((bool) => bool);

    expect(results).toHaveLength(1);
  });

  it('should return true twice when called 200 times', () => {
    const tracker = new TransactionTracker();

    // call to increment counter
    const results = new Array(200)
      .fill(false)
      .map(() => {
        tracker.bumpDispatchCounter(options);
        return tracker.shouldTrackTransaction(options);
      })
      .filter((bool) => bool);

    expect(results).toHaveLength(2);
  });
});

describe('getMeasureHelpers', () => {
  it('should return noops if tracking is disabled', () => {
    const tracker = new TransactionTracker();
    const {
      startMeasure: resultStart,
      stopMeasure: resultStop,
    } = tracker.getMeasureHelpers({ enabled: false });

    expect(resultStart).toEqual(resultStop);
  });

  it('should return simple methods by default', () => {
    const tracker = new TransactionTracker();
    const {
      startMeasure: resultStart,
      stopMeasure: resultStop,
    } = tracker.getMeasureHelpers({ enabled: true });

    expect(resultStart).not.toEqual(startMeasureWithMark);
    expect(resultStop).not.toEqual(stopMeasureWithMark);
  });

  it('should return simple methods when usePerformanceMarks is false', () => {
    const tracker = new TransactionTracker();
    const {
      startMeasure: resultStart,
      stopMeasure: resultStop,
    } = tracker.getMeasureHelpers({
      enabled: true,
      usePerformanceMarks: false,
    });

    expect(resultStart).not.toEqual(startMeasureWithMark);
    expect(resultStop).not.toEqual(stopMeasureWithMark);
  });

  it('should return performance API mark measure methods when usePerformanceMarks is true', () => {
    const tracker = new TransactionTracker();
    const {
      startMeasure: resultStart,
      stopMeasure: resultStop,
    } = tracker.getMeasureHelpers({
      enabled: true,
      usePerformanceMarks: true,
      samplingRate: 0,
    });

    expect(resultStart).toEqual(startMeasureWithMark);
    expect(resultStop).toEqual(stopMeasureWithMark);
  });
});

describe('simple startMeasure and stopMeasure', () => {
  const tracker = new TransactionTracker();
  const {
    startMeasure: simpleStartMeasure,
    stopMeasure: simpleStopMeasure,
  } = tracker.getMeasureHelpers({ enabled: true, samplingRate: 0 });

  it('should measure timing between function calls', () => {
    const timeInMs = 8;
    const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
    getTimeSinceMock.mockImplementation((startTime) => timeInMs);

    simpleStartMeasure('test1');
    simpleStopMeasure('test1', (duration: number, startTime: number) => {
      expect(duration).toEqual(timeInMs);
    });

    getTimeSinceMock.mockClear();
  });

  it('should not call measured callback if mismatched name', () => {
    const spy = jest.fn();

    simpleStartMeasure('test3');
    simpleStopMeasure('test4', spy);

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
