import { measureTTI } from './measure-tti';

jest.useFakeTimers();
jest.mock('./is-performance-api-available', () => ({
  isPerformanceObserverLongTaskAvailable: () => true,
}));

describe('Measure TTI utility', () => {
  let time = 100;
  let perfNow = (global as any).performance.now;
  beforeEach(() => {
    time = 100;
    (global as any).performance.now = () => time;
  });

  afterEach(() => {
    (global as any).performance.now = perfNow;
  });

  describe('No long tasks', () => {
    it('should fire callback right away', () => {
      const [, MockPerformanceObserver] = createMockPerformanceObserver();
      const cb = jest.fn();
      measureTTI(cb, 100, 1, MockPerformanceObserver);
      time += 100;
      jest.advanceTimersByTime(100);
      expect(cb).toBeCalledWith(100, 0, false);
    });
  });

  describe('Only 1 long task', () => {
    it('should return end time of the only long task', () => {
      const [
        trigger,
        MockPerformanceObserver,
      ] = createMockPerformanceObserver();
      const cb = jest.fn();
      const now = performance.now();

      measureTTI(cb, 100, 1, MockPerformanceObserver);
      trigger({ startTime: now, duration: 100 });

      time += 100;
      jest.advanceTimersByTime(100);

      time += 100;
      jest.advanceTimersByTime(100);

      expect(cb).toBeCalledWith(200, 100, false);
    });
  });

  describe('Multiple long tasks', () => {
    it('should return end time of the last long task no sufficient idle time', () => {
      const [
        trigger,
        MockPerformanceObserver,
      ] = createMockPerformanceObserver();
      const cb = jest.fn();
      const now = performance.now();

      measureTTI(cb, 100, 1, MockPerformanceObserver);

      trigger({ startTime: now, duration: 50 });
      trigger({ startTime: now + 50, duration: 100 });

      time += 150;
      jest.advanceTimersByTime(100);

      time += 100;
      jest.advanceTimersByTime(100);

      expect(cb).toBeCalledWith(250, 150, false);
    });

    it('should return end time of a long task with sufficient idle time', () => {
      const [
        trigger,
        MockPerformanceObserver,
      ] = createMockPerformanceObserver();
      const cb = jest.fn();
      const now = performance.now();

      measureTTI(cb, 100, 1, MockPerformanceObserver);

      trigger({ startTime: now, duration: 50 });
      trigger({ startTime: now + 150, duration: 100 });

      time += 50 + 100;
      jest.advanceTimersByTime(100);

      time += 100;
      jest.advanceTimersByTime(100);

      expect(cb).toBeCalledWith(now + 50, 50, false);
    });
  });

  describe('Cancel', () => {
    it('should cancel tti measurements after `cancelAfter` time', () => {
      const [
        trigger,
        MockPerformanceObserver,
      ] = createMockPerformanceObserver();
      const cb = jest.fn();
      const now = performance.now();

      measureTTI(cb, 100, 1, MockPerformanceObserver);

      trigger({ startTime: now, duration: 2000 });
      time += 2000;
      jest.advanceTimersByTime(100);

      trigger({ startTime: time, duration: 50 });
      time += 100;
      jest.advanceTimersByTime(100);

      expect(cb).toBeCalledWith(now + 2000 + 50, 2050, true);
    });
  });
});

function createMockPerformanceObserver(): [
  (event: Pick<PerformanceEntry, 'startTime' | 'duration'>) => void,
  typeof PerformanceObserver,
] {
  let callback: Function;
  class MockPerformanceObserver extends PerformanceObserver {
    static supportedEntryTypes = [];

    constructor(cb: PerformanceObserverCallback) {
      super(cb);
      callback = cb;
    }
  }

  return [
    (event) => callback({ getEntries: () => [event] }),
    MockPerformanceObserver,
  ];
}
