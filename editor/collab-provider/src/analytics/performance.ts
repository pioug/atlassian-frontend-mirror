type MeasureName = 'callingCatchupApi';

const isPerformanceAPIAvailable = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'performance' in window &&
    [
      'measure',
      'clearMeasures',
      'clearMarks',
      'getEntriesByName',
      'getEntriesByType',
    ].every((api) => !!(performance as any)[api])
  );
};
const hasPerformanceAPIAvailable = isPerformanceAPIAvailable();

const measureMap = new Map<string, number>();

export function startMeasure(measureName: MeasureName) {
  if (!hasPerformanceAPIAvailable) {
    return;
  }

  performance.mark(`${measureName}::start`);
  measureMap.set(measureName, performance.now());
}

export function stopMeasure(
  measureName: MeasureName,
  onMeasureComplete?: (duration: number, startTime: number) => void,
) {
  if (!hasPerformanceAPIAvailable) {
    return;
  }

  // `startMeasure` is not called with `measureName` before.
  if (!measureMap.get(measureName)) {
    return;
  }

  performance.mark(`${measureName}::end`);
  const start = onMeasureComplete ? measureMap.get(measureName) : undefined;
  try {
    performance.measure(
      measureName,
      `${measureName}::start`,
      `${measureName}::end`,
    );
  } catch (error) {
  } finally {
    if (onMeasureComplete) {
      const entry = performance.getEntriesByName(measureName).pop();
      if (entry) {
        onMeasureComplete(entry.duration, entry.startTime);
      } else if (start) {
        onMeasureComplete(performance.now() - start, start);
      }
    }
    clearMeasure(measureName);
  }
}

export function clearMeasure(measureName: string) {
  if (!hasPerformanceAPIAvailable) {
    return;
  }

  measureMap.delete(measureName);
  performance.clearMarks(`${measureName}::start`);
  performance.clearMarks(`${measureName}::end`);
  performance.clearMeasures(measureName);
}
