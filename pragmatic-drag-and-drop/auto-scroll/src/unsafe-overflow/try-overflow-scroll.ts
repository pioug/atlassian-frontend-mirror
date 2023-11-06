import type {
  AllDragTypes,
  Input,
} from '@atlaskit/pragmatic-drag-and-drop/types';

import { ElementGetFeedbackArgs } from '../internal-types';

import { getScrollBy } from './get-scroll-by';
import { UnsafeOverflowAutoScrollArgs } from './types';

export function tryOverflowScrollElements<DragType extends AllDragTypes>({
  input,
  source,
  entries,
  timeSinceLastFrame,
}: {
  input: Input;
  timeSinceLastFrame: number;
  source: DragType['payload'];
  entries: UnsafeOverflowAutoScrollArgs<DragType>[];
}): void {
  // Notes
  // - This is the same starting point as the "over element" auto scroller,
  //   which is important to ensure that there is a clean handover between the auto scroller's
  // - Doing this lookup here so it can be shared for all the entries.
  const underUsersPointer = document.elementFromPoint(
    input.clientX,
    input.clientY,
  );

  // For now we are auto scrolling any element that wants to.
  // Otherwise it's hard to know what should scroll first as we might
  // be scrolling elements that have no hierarchical relationship
  for (const entry of entries) {
    // "overflow" scrolling not relevant when directly over the element
    // "over element" scrolling is responsible for scrolling when over an element
    // 1. If we are over the element, then we want to exit and let the "overflow" scroller take over
    // 2. The overflow hitbox area for an edge actually stretches over the element
    //    This check is used to "mask" or "cut out" the element hitbox from the overflow hitbox
    if (entry.element.contains(underUsersPointer)) {
      continue;
    }

    const feedback: ElementGetFeedbackArgs<DragType> = {
      input,
      source,
      element: entry.element,
    };

    // Scrolling not allowed for this entity
    // Note: not marking engagement if an entity is opting out of scrolling
    if (entry.canScroll && !entry.canScroll(feedback)) {
      continue;
    }

    const scrollBy = getScrollBy({
      entry,
      input,
      timeSinceLastFrame,
    });

    if (scrollBy) {
      entry.element.scrollBy(scrollBy);
    }
  }
}
