import { SEVERITY } from '../analytics';

import { isPerformanceObserverLongTaskAvailable } from './is-performance-api-available';

export function measureTTI(
  onMeasureComplete: (
    tti: number,
    ttiFromInvocation: number,
    canceled: boolean,
  ) => void,
  idleThreshold: number = 1000,
  cancelAfter: number = 60,

  // Dependency Injection for easier testing
  PerfObserver?: typeof window.PerformanceObserver,
) {
  if (!isPerformanceObserverLongTaskAvailable()) {
    return;
  }

  const start = performance.now();
  let prevLongTask:
    | Pick<PerformanceEntry, 'startTime' | 'duration'>
    | undefined;
  let lastLongTask: Pick<PerformanceEntry, 'startTime' | 'duration'> = {
    startTime: start,
    duration: 0,
  };
  let cancelAfterMs = cancelAfter * 1000;
  const observer = new (PerfObserver || PerformanceObserver)((list) => {
    const entries = list.getEntries();
    if (entries.length) {
      prevLongTask = lastLongTask;
      lastLongTask = entries[entries.length - 1];
    }
  });

  observer.observe({ entryTypes: ['longtask'] });

  const checkIdle = () => {
    // 1. There hasn't been any long task in `idleThreshold` time: Interactive from the start.
    // 2. Only 1 long task: Interactive from the end of the only long task.
    // 3. Several long tasks:
    //    3.1 Interactive from the end of prevLongTask if `lastLongTask.start - prevLongTask.end >= idleThreshold`
    //    3.2 Interactive from the end of lastLongTask if `lastLongTask.start - prevLongTask.end < idleThreshold`

    const now = performance.now();
    const lastEnd = lastLongTask.startTime + lastLongTask.duration;
    const prevEnd = prevLongTask
      ? prevLongTask.startTime + prevLongTask.duration
      : lastEnd;

    if (!prevLongTask) {
      observer.disconnect();
      return onMeasureComplete(prevEnd, 0, false);
    } else if (lastLongTask.startTime - prevEnd >= idleThreshold) {
      observer.disconnect();
      return onMeasureComplete(prevEnd, prevEnd - start, cancelAfterMs <= 0);
    } else if (now - lastEnd >= idleThreshold || cancelAfterMs <= 0) {
      observer.disconnect();
      return onMeasureComplete(lastEnd, lastEnd - start, cancelAfterMs <= 0);
    }

    cancelAfterMs = Math.max(0, cancelAfterMs - (now - start));
    return setTimeout(checkIdle, idleThreshold);
  };

  setTimeout(checkIdle, idleThreshold);
}

export const TTI_SEVERITY_THRESHOLD_DEFAULTS = {
  NORMAL: 40000,
  DEGRADED: 60000,
};

export const TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS = {
  NORMAL: 5000,
  DEGRADED: 8000,
};

export function getTTISeverity(
  tti: number,
  ttiFromInvocation: number,
  ttiSeverityNormalTheshold?: number,
  ttiSeverityDegradedThreshold?: number,
  ttiFromInvocationSeverityNormalThreshold?: number,
  ttiFromInvocationSeverityDegradedThreshold?: number,
): { ttiSeverity: SEVERITY; ttiFromInvocationSeverity: SEVERITY } {
  const ttiNormalThreshold =
    ttiSeverityNormalTheshold || TTI_SEVERITY_THRESHOLD_DEFAULTS.NORMAL;
  const ttiDegradedThreshold =
    ttiSeverityDegradedThreshold || TTI_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED;
  let ttiSeverity: SEVERITY;
  if (tti >= ttiNormalThreshold && tti < ttiDegradedThreshold) {
    ttiSeverity = SEVERITY.DEGRADED;
  } else if (tti >= ttiDegradedThreshold) {
    ttiSeverity = SEVERITY.BLOCKING;
  } else {
    ttiSeverity = SEVERITY.NORMAL;
  }

  const ttiFromInvocationNormalThreshold =
    ttiFromInvocationSeverityNormalThreshold ||
    TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.NORMAL;
  const ttiFromInvocationDegradedThreshold =
    ttiFromInvocationSeverityDegradedThreshold ||
    TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED;
  let ttiFromInvocationSeverity: SEVERITY;
  if (
    ttiFromInvocation >= ttiFromInvocationNormalThreshold &&
    ttiFromInvocation < ttiFromInvocationDegradedThreshold
  ) {
    ttiFromInvocationSeverity = SEVERITY.DEGRADED;
  } else if (ttiFromInvocation >= ttiFromInvocationDegradedThreshold) {
    ttiFromInvocationSeverity = SEVERITY.BLOCKING;
  } else {
    ttiFromInvocationSeverity = SEVERITY.NORMAL;
  }

  return { ttiSeverity, ttiFromInvocationSeverity };
}
