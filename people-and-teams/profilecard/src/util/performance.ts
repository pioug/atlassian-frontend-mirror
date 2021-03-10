const isPerformanceAvailable = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'performance' in window &&
    !!performance.now
  );
};

const performanceAvailable = isPerformanceAvailable();

const initialPageTime: number = Date.now();

export const getPageTime = (): number => {
  if (performanceAvailable) {
    return performance.now();
  }

  return Date.now() - initialPageTime;
};
