import type {
  AllDragTypes,
  BaseEventPayload,
  CleanupFn,
  MonitorArgs,
} from '@atlaskit/pragmatic-drag-and-drop/types';

import { clearHistory, clearUnusedEngagements } from './engagement-history';
import type {
  GetFeedbackArgs,
  ScrollContainerArgs,
  WindowArgs,
} from './internal-types';
import { scheduler } from './scheduler';

export function makeApi<DragType extends AllDragTypes>({
  monitor,
}: {
  monitor: (args: MonitorArgs<DragType>) => CleanupFn;
}) {
  const ledger: Map<Element, ScrollContainerArgs<DragType>> = new Map();

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

    return () => ledger.delete(args.element);
  }

  function autoScrollWindow(args: WindowArgs<DragType>): CleanupFn {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('window auto scrolling not yet implemented');
    }

    // TODO
    return () => {};
  }

  // const scroller = makeScroller({ findContainerEntry });

  function onFrame({
    latestArgs,
    timeSinceLastFrame,
  }: {
    latestArgs: BaseEventPayload<DragType>;
    timeSinceLastFrame: number;
  }) {
    clearUnusedEngagements(() => {
      ledger.forEach(entry => {
        const input = latestArgs.location.current.input;
        const feedback: GetFeedbackArgs<DragType> = {
          input,
          source: latestArgs.source,
          element: entry.element,
        };

        const canScroll = Boolean(
          entry.canScroll ? entry.canScroll(feedback) : true,
        );

        if (!canScroll) {
          return;
        }

        entry.behavior?.forEach(behavior => {
          behavior.onFrame({
            element: entry.element,
            input,
            timeSinceLastFrame,
          });
        });
      });
    });
  }

  // scheduler is never cleaned up
  scheduler({
    monitor,
    onFrame,
    // TODO: do we need a reset?
    onReset() {
      clearHistory();
    },
    // onReset: scroller.reset,
  });

  return {
    autoScroll,
    autoScrollWindow,
  };
}
