const result = {
  supportsIntersectionObserver: false,
  supportsResizeObserver: false,
};

function supportsIntersectionObserver() {
  if (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in (window as any).IntersectionObserverEntry.prototype
  ) {
    return true;
  }
  return false;
}

function supportsResizeObserver() {
  if (
    typeof window !== 'undefined' &&
    'ResizeObserver' in window &&
    'ResizeObserverEntry' in window
  ) {
    return true;
  }
  return false;
}

if (typeof navigator !== 'undefined') {
  result.supportsIntersectionObserver = supportsIntersectionObserver();
  result.supportsResizeObserver = supportsResizeObserver();
}

export const browser = result;
