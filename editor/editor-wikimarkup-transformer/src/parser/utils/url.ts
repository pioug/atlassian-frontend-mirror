/**
 * returns a correctly percent-encoded & sanitized url.
 * Will fallback to using a DOM based implementation if the `URL` class
 * doesn't exist.
 *
 * @param raw a 'raw' url (possibly mixed percent-encoded).
 */
export function decode(raw: string): string {
  if (typeof URL === 'function') {
    const decoded = new URL(raw);
    // IE11 doesn't support the `href` property in the `URL` class.
    // Fallback to the DOM below if it doesn't exist.
    if (decoded.href) {
      return decoded.href;
    }
  }
  // no `URL` class - pollyfill using the dom to parse and
  // decode. This should only be needed for IE11 or lower...
  const anchor = document.createElement('a');
  anchor.href = raw; // The DOM will parses even mixed %-encoded segments of a url when set.
  return anchor.href;
}
