export enum MEASURE_NAME {
  SOCKET_CONNECT = 'socketConnect',
  DOCUMENT_INIT = 'documentInit',
  CONVERT_PM_TO_ADF = 'convertPMToADF',
  COMMIT_UNCONFIRMED_STEPS = 'commitUnconfirmedSteps',
}

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

export function startMeasure(measureName: MEASURE_NAME) {
  if (!hasPerformanceAPIAvailable) {
    return;
  }

  performance.mark(`${measureName}::start`);
  measureMap.set(measureName, performance.now());
}

export function stopMeasure(
  measureName: MEASURE_NAME,
  onMeasureComplete?: (duration: number, startTime: number) => void,
): { duration: number; startTime: number } | undefined {
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
  } catch (e) {}

  const entry = performance.getEntriesByName(measureName).pop();
  clearMeasure(measureName);
  let measure;
  if (entry) {
    measure = { duration: entry.duration, startTime: entry.startTime };
  } else if (start) {
    measure = { duration: performance.now() - start, startTime: start };
  }
  if (measure && onMeasureComplete) {
    onMeasureComplete(measure.duration, measure.startTime);
  }
  return measure;
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
