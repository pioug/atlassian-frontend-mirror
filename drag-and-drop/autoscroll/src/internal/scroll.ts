import type { Input, Position } from '@atlaskit/drag-and-drop/types';

import { getClosestScrollableElement } from './get-closest-scrollable-element';
import { getScrollable } from './get-scrollable';
import getScrollableScrollChange from './get-scrollable-scroll-change';
import getWindowScrollChange from './get-window-scroll-change';
import type { Scrollable } from './types';
import getViewport from './window/get-viewport';

type Args = {
  input: Input;
  dragStartTime: number;
  shouldUseTimeDampening: boolean;
  scrollElement: (element: Element, change: Position) => void;
  scrollWindow: (change: Position) => void;
};

export const scroll = ({
  input,
  dragStartTime,
  shouldUseTimeDampening,
  scrollElement,
  scrollWindow,
}: Args) => {
  // 1. try to scroll the viewport first

  const viewport = getViewport();
  const windowScrollChange: Position | null = getWindowScrollChange({
    dragStartTime,
    viewport,
    center: {
      x: input.clientX + viewport.scroll.current.x,
      y: input.clientY + viewport.scroll.current.y,
    },
    shouldUseTimeDampening,
  });

  if (windowScrollChange) {
    scrollWindow(windowScrollChange);
    return;
  }

  // if we could not scroll the viewport, see if we can scroll a scroll container

  const over = document.elementFromPoint(input.clientX, input.clientY);
  const closestScrollable: Element | null = getClosestScrollableElement(over);

  if (!closestScrollable) {
    return;
  }

  const scrollable: Scrollable = getScrollable({
    closestScrollable,
  });

  const scrollableScrollChange: Position | null = getScrollableScrollChange({
    dragStartTime,
    scrollable,
    center: { x: input.clientX, y: input.clientY },
    shouldUseTimeDampening,
  });

  if (scrollableScrollChange) {
    scrollElement(closestScrollable, scrollableScrollChange);
  }
};
