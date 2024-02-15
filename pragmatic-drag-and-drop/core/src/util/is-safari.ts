// Once we know we are in Safari or not, we don't need to do the check again
let cache: boolean | null = null;

/**
 * Returns `true` if a `Safari` browser.
 * Returns `true` if the browser is running on iOS (they are all Safari).
 * */
export function isSafari(): boolean {
  if (typeof cache === 'boolean') {
    return cache;
  }

  const { userAgent } = navigator;
  cache = userAgent.includes('AppleWebKit') && !userAgent.includes('Chrome');
  return cache;
}
