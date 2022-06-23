export const isIntersectionObserverSupported =
  typeof window !== 'undefined' &&
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in (window as any).IntersectionObserverEntry.prototype;
