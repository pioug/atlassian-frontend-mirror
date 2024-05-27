import { type MutableRefObject, useRef } from 'react';

import { type MediaFilePreviewDimensions } from './types';

/**
 * Checks if at least one of next dimensions is bigger than current
 * If a single dimension is undefined, returns false
 */
export const isBigger = (
  current?: MediaFilePreviewDimensions,
  next?: MediaFilePreviewDimensions,
) => {
  const { width: currentWidth, height: currentHeight } = current || {};
  const { width: nextWidth, height: nextHeight } = next || {};

  if (!!currentWidth && !!currentHeight && !!nextWidth && !!nextHeight) {
    const nextIsWider = currentWidth < nextWidth;
    const nextIsHigher = currentHeight < nextHeight;
    return nextIsHigher || nextIsWider;
  } else {
    return false;
  }
};

/** Verifies if the current screen is retina display */
function isRetina(): boolean {
  const mediaQuery =
    '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

  return (
    window.devicePixelRatio > 1 ||
    (window.matchMedia && window.matchMedia(mediaQuery).matches)
  );
}

export const createRequestDimensions = (
  dimensions: Partial<MediaFilePreviewDimensions>,
): Partial<MediaFilePreviewDimensions> | undefined => {
  if (!dimensions) {
    return;
  }
  const retinaFactor = isRetina() ? 2 : 1;
  const { width, height } = dimensions;

  const result: Partial<MediaFilePreviewDimensions> = {};
  if (width) {
    result.width = width * retinaFactor;
  }
  if (height) {
    result.height = height * retinaFactor;
  }
  return result;
};

/** Stores the provided value in a ref object to avoid "component rerenders" when the value is used as a hook dependency */
export function useCurrentValueRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}
