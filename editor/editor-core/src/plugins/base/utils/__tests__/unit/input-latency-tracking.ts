import * as timingUtils from '../../../../../utils/performance/get-performance-timing';
import InputLatencyTracker from '../../input-latency-tracking';

describe('InputLatencyTracker', () => {
  describe('calls handlers with correct information', () => {
    it('with uneven samples', () => {
      const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
      getTimeSinceMock
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(8)
        .mockReturnValueOnce(9)
        .mockReturnValueOnce(11)
        .mockReturnValueOnce(16);

      const onSampleStart = jest.fn();
      const onSampleEnd = jest.fn();
      const dispatchAverage = jest.fn();
      const dispatchSample = jest.fn();
      const onSlowInput = jest.fn();

      const tracker = new InputLatencyTracker({
        samplingRate: 5,
        normalThreshold: 10,
        slowThreshold: 10,
        degradedThreshold: 15,
        onSampleStart,
        onSampleEnd,
        dispatchAverage,
        dispatchSample,
        onSlowInput,
      });

      for (let i = 0; i < 5; i++) {
        tracker.start();
        tracker.end();
      }

      expect(onSampleStart).toHaveBeenCalledTimes(1);

      expect(onSampleEnd).toHaveBeenCalledTimes(1);
      expect(onSampleEnd).toHaveBeenCalledWith(16, {
        isSlow: true,
        severity: 'blocking',
      });

      expect(dispatchSample).toHaveBeenCalledTimes(1);
      expect(dispatchSample).toHaveBeenCalledWith(16, 'blocking');

      expect(dispatchAverage).toHaveBeenCalledTimes(1);
      expect(dispatchAverage).toHaveBeenCalledWith(
        {
          mean: 10,
          median: 9,
          sampleSize: 5,
        },
        'normal',
      );

      expect(onSlowInput).toHaveBeenCalledTimes(2);
      expect(onSlowInput).toHaveBeenNthCalledWith(1, 11);
      expect(onSlowInput).toHaveBeenNthCalledWith(2, 16);
    });

    it('with even samples', () => {
      const getTimeSinceMock = jest.spyOn(timingUtils, 'getTimeSince');
      getTimeSinceMock
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(8)
        .mockReturnValueOnce(9)
        .mockReturnValueOnce(11)
        .mockReturnValueOnce(16)
        .mockReturnValue(10);

      const onSampleStart = jest.fn();
      const onSampleEnd = jest.fn();
      const dispatchAverage = jest.fn();
      const dispatchSample = jest.fn();
      const onSlowInput = jest.fn();

      const tracker = new InputLatencyTracker({
        samplingRate: 6,
        normalThreshold: 10,
        slowThreshold: 10,
        degradedThreshold: 15,
        onSampleStart,
        onSampleEnd,
        dispatchAverage,
        dispatchSample,
        onSlowInput,
      });

      for (let i = 0; i < 6; i++) {
        tracker.start();
        tracker.end();
      }

      expect(onSampleStart).toHaveBeenCalledTimes(1);

      expect(onSampleEnd).toHaveBeenCalledTimes(1);
      expect(onSampleEnd).toHaveBeenCalledWith(10, {
        isSlow: false,
        severity: 'normal',
      });

      expect(dispatchSample).toHaveBeenCalledTimes(1);
      expect(dispatchSample).toHaveBeenCalledWith(10, 'normal');

      expect(dispatchAverage).toHaveBeenCalledTimes(1);
      expect(dispatchAverage).toHaveBeenCalledWith(
        {
          mean: 10,
          median: 9.5,
          sampleSize: 6,
        },
        'normal',
      );

      expect(onSlowInput).toHaveBeenCalledTimes(2);
      expect(onSlowInput).toHaveBeenNthCalledWith(1, 11);
      expect(onSlowInput).toHaveBeenNthCalledWith(2, 16);
    });
  });
});
