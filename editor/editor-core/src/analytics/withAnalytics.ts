import analyticsService from './service';

export function withAnalytics(analyticsEventName: string, trackedFn: Function) {
  return (...args: any[]) => {
    const result = trackedFn(...args);
    if (result) {
      try {
        analyticsService.trackEvent(analyticsEventName);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          'An exception has been thrown when trying to track analytics event:',
          e,
        );
      }
    }
    return result;
  };
}
