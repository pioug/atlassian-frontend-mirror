import * as bytes from 'bytes';

// eslint-disable-next-line no-bitwise
const ONE_MEGABYTE_IN_BYTES = 1 << 20;

/**
 * Takes a media (file) size in bytes and returns a human readable string
 */
export function toHumanReadableMediaSize(size: number): string {
  // [MS-967]: Api issue might return string for size
  const parsedSize = parseInt(`${size}`, 10);
  const decimalPlaces = parsedSize < ONE_MEGABYTE_IN_BYTES ? 0 : 1;

  return bytes
    .format(parsedSize, {
      unitSeparator: ' ',
      decimalPlaces,
    })
    .toUpperCase();
}
