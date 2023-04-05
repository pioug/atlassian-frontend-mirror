type BrowserSupport = {
  mac: boolean;
  supportsIntersectionObserver: boolean;
};

const result: BrowserSupport = {
  mac: false,
  supportsIntersectionObserver: false,
};

if (typeof navigator !== 'undefined') {
  result.mac = /Mac/.test(navigator.platform);

  result.supportsIntersectionObserver =
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in (window as any).IntersectionObserverEntry.prototype;
}

export default result;
