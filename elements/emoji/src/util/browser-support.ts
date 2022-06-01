export const isIntersectionObserverSupported =
  typeof window === 'undefined'
    ? false
    : !!(window as any).IntersectionObserver;
