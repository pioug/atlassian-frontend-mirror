import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

/**
 * Returns how far the body is scrolled from the top of the viewport.
 *
 *   ____
 * ||____|| <-- overflow
 *  |    |  <-- viewport
 *  |____|
 *
 * Scroll distance is the height of overflow outside the viewport.
 */
function getScrollDistance(): number {
  return (
    window.pageYOffset ||
    document.documentElement?.scrollTop ||
    document.body?.scrollTop ||
    0
  );
}

/**
 * Prevents programatic scrolling of the viewport with `scrollIntoView`.
 * Should be used in conjunction with a scroll lock to prevent a user from scrolling.
 *
 * @returns scroll top offset of the viewport
 */
export default function usePreventProgrammaticScroll(): number {
  const [scrollTopOffset, setScrollTopOffset] = useState(0);

  useLayoutEffect(() => {
    setScrollTopOffset(getScrollDistance());
  }, []);

  const onWindowScroll = useCallback(() => {
    if (getScrollDistance() !== scrollTopOffset) {
      window.scrollTo(window.pageXOffset, scrollTopOffset);
    }
  }, [scrollTopOffset]);

  useEffect(() => {
    return bind(window, {
      type: 'scroll',
      listener: onWindowScroll,
    });
  }, [onWindowScroll]);

  return scrollTopOffset;
}
