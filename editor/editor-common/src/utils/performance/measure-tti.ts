import { isPerformanceObserverLongTaskAvailable } from './is-performance-api-available';

export function measureTTI(
  onMeasureComplete: (
    tti: number,
    ttiFromInvocation: number,
    canceled: boolean,
  ) => void,
  idleThreshold: number = 1000,
  cancelAfter: number = 60,
) {
  if (!isPerformanceObserverLongTaskAvailable()) {
    return;
  }

  let lastLongTask: PerformanceEntry | undefined;
  let cancelAfterMs = cancelAfter * 1000;
  const start = performance.now();
  const observer = new PerformanceObserver(list => {
    const entries = list.getEntries();
    if (entries.length) {
      lastLongTask = entries[entries.length - 1];
    }
  });

  observer.observe({ entryTypes: ['longtask'] });

  const checkIdle = () => {
    if (!lastLongTask) {
      return setTimeout(checkIdle, idleThreshold);
    }

    const lastEnd = lastLongTask.startTime + lastLongTask.duration;

    if (performance.now() - lastEnd >= idleThreshold || cancelAfterMs <= 0) {
      observer.disconnect();
      return onMeasureComplete(lastEnd, lastEnd - start, cancelAfterMs <= 0);
    }

    cancelAfterMs -= idleThreshold;
    return setTimeout(checkIdle, idleThreshold);
  };

  checkIdle();
}
