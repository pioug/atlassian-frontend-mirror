import { CardType } from '../state/store/types';

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

export const getMarkName = (id: string, status: CardType) => `${status}:${id}`;
export const getMeasureName = (id: string, status: CardType) =>
  `time-to-${status}:${id}`;

export const clearMarks = (id: string) => {
  if (hasPerformanceAPIAvailable) {
    const marks = performance
      .getEntriesByType('mark')
      .filter((mark) => mark.name.includes(id));
    marks.forEach((mark) => performance.clearMarks(mark.name));
  }
};

export const clearMeasures = (id: string) => {
  if (hasPerformanceAPIAvailable) {
    const measures = performance
      .getEntriesByType('measure')
      .filter((measure) => measure.name.includes(id));
    measures.forEach((measure) => performance.clearMeasures(measure.name));
  }
};

const getMark = (
  id: string,
  status: CardType,
): PerformanceEntry | undefined => {
  if (hasPerformanceAPIAvailable) {
    const name = getMarkName(id, status);
    const marks = performance.getEntriesByName(name);
    if (marks.length > 0) {
      return marks[0];
    }
    return undefined;
  }
};

export const getMeasure = (
  id: string,
  status: CardType,
): PerformanceMeasure | undefined => {
  if (hasPerformanceAPIAvailable) {
    const name = getMeasureName(id, status);
    const measures = performance.getEntriesByName(name);
    if (measures.length > 0) {
      return measures[0];
    }
    return undefined;
  }
};

export const mark = (id: string, status: CardType): void => {
  if (hasPerformanceAPIAvailable) {
    const name = getMarkName(id, status);
    performance.mark(name);
  }
};

export const create = (id: string, status: CardType): void => {
  if (hasPerformanceAPIAvailable) {
    const name = getMeasureName(id, status);
    const measure = getMeasure(id, status);
    if (!measure) {
      const startMark = getMark(id, 'pending');
      const endMark = getMark(id, status);
      if (startMark && endMark) {
        performance.measure(name, startMark.name, endMark.name);
      }
    }
  }
};
