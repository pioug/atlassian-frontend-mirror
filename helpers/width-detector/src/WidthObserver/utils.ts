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

export function getIEVersion(): number | null {
  const ieEdge = /Edge\/(\d+)/.exec(navigator.userAgent);
  const ieUpTo10 = /MSIE \d/.test(navigator.userAgent);
  const ie11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(
    navigator.userAgent,
  );

  if (ieUpTo10) {
    return (document as any).documentMode || 6;
  }

  if (ie11up) {
    return +ie11up[1];
  }

  if (ieEdge) {
    return +ieEdge[1];
  }

  return null;
}

if (typeof navigator !== 'undefined') {
  result.supportsIntersectionObserver = supportsIntersectionObserver();
  result.supportsResizeObserver = supportsResizeObserver();
}

export const browser = result;
