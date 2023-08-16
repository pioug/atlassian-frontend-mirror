// TODO: export all drag types
import type {
  AllDragTypes,
  CleanupFn,
  MonitorArgs,
} from '@atlaskit/pragmatic-drag-and-drop/types';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';

import { addAttribute } from './add-attribute';
import { scrollContainerDataAttr } from './data-attributes';
import type { ScrollContainerArgs, WindowArgs } from './internal-types';
import { scheduler } from './scheduler';
import { makeScroller } from './scroller/make-scroller';

export function makeApi<DragType extends AllDragTypes>({
  monitor,
}: {
  monitor: (args: MonitorArgs<DragType>) => CleanupFn;
}) {
  const ledger: Map<Element, ScrollContainerArgs<DragType>> = new Map();

  function findContainerEntry(
    element: Element,
  ): ScrollContainerArgs<DragType> | null {
    return ledger.get(element) ?? null;
  }

  function autoScroll(args: ScrollContainerArgs<DragType>): CleanupFn {
    ledger.set(args.element, args);

    // Warn during development if trying to add auto scroll to an element
    // that is not scrollable.
    // Note: this can produce a false positive when a scroll container is not
    // scrollable initially, but becomes scrollable during a drag.
    // I thought of adding the warning as I think it would be a more common pitfall
    // to accidentally register auto scrolling on the wrong element
    // If requested, we could provide a mechanism to opt out of this warning
    if (process.env.NODE_ENV !== 'production') {
      const { overflowX, overflowY }: CSSStyleDeclaration =
        window.getComputedStyle(args.element);
      const isScrollable =
        overflowX === 'auto' ||
        overflowX === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll';
      if (!isScrollable) {
        // eslint-disable-next-line no-console
        console.warn(
          'Auto scrolling has been attached to an element that appears not to be scrollable',
          { element: args.element, overflowX, overflowY },
        );
      }
    }

    return combine(
      addAttribute(args.element, {
        attribute: scrollContainerDataAttr,
        value: 'true',
      }),
      () => ledger.delete(args.element),
    );
  }

  function autoScrollWindow(args: WindowArgs<DragType>): CleanupFn {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('window auto scrolling not yet implemented');
    }

    return () => {};
  }

  const scroller = makeScroller({ findContainerEntry });

  // scheduler is never cleaned up
  scheduler({
    monitor,
    onScroll: scroller.scroll,
    onReset: scroller.reset,
  });

  return {
    autoScroll,
    autoScrollWindow,
  };
}
