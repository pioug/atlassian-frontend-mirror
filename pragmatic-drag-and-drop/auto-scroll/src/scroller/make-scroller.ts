import type {
  AllDragTypes,
  BaseEventPayload,
  Position,
} from '@atlaskit/pragmatic-drag-and-drop/types';

import { scrollContainerSelector } from '../data-attributes';
import {
  EngagementHistoryEntry,
  GetFeedbackArgs,
  ScrollContainerArgs,
} from '../internal-types';

import { findScrollableEdges } from './find-scrollable-edges';
import { getScrollBy } from './get-scroll-by';

function findScrollContainers<DragType extends AllDragTypes>({
  target,
  findContainerEntry,
  result = [],
}: {
  target: Element | null;
  findContainerEntry: (
    element: Element,
  ) => ScrollContainerArgs<DragType> | null;
  result?: ScrollContainerArgs<DragType>[];
}): ScrollContainerArgs<DragType>[] {
  if (!(target instanceof Element)) {
    return result;
  }

  const closest = target.closest(scrollContainerSelector);

  // cannot find any other scroll containers
  if (closest == null) {
    return result;
  }

  const args: ScrollContainerArgs<DragType> | null =
    findContainerEntry(closest);

  // error: something had a dropTargetSelector but we could not
  // find a match. For now, failing silently
  if (args == null) {
    return result;
  }

  return findScrollContainers({
    target: args.element.parentElement,
    findContainerEntry,
    // Using bubble ordering. Same ordering as `event.getPath()`
    result: [...result, args],
  });
}

export function makeScroller<DragType extends AllDragTypes>({
  findContainerEntry,
}: {
  findContainerEntry: (
    element: Element,
  ) => ScrollContainerArgs<DragType> | null;
}) {
  const engagementHistory = new Map<Element, EngagementHistoryEntry>();

  function getHistoryAndSetIfNeeded(element: Element): EngagementHistoryEntry {
    const entry = engagementHistory.get(element);
    if (entry) {
      return entry;
    }
    const created = { timeOfEngagementStart: Date.now() };
    engagementHistory.set(element, created);
    return created;
  }

  function scroll({
    latestArgs: { source, location },
    timeSinceLastFrame,
  }: {
    latestArgs: BaseEventPayload<DragType>;
    timeSinceLastFrame: number;
  }): void {
    const input = location.current.input;
    const client: Position = {
      x: input.clientX,
      y: input.clientY,
    };
    const underUsersPointer = document.elementFromPoint(client.x, client.y);

    const overContainers = findScrollContainers({
      target: underUsersPointer,
      findContainerEntry,
    });

    overContainers.forEach(container => {
      const feedback: GetFeedbackArgs<DragType> = {
        input,
        source,
        element: container.element,
      };

      const canScroll = Boolean(
        container.canScroll ? container.canScroll(feedback) : true,
      );

      if (!canScroll) {
        return;
      }

      // even if there are no scrollable edges
      // we start time dampening
      const history = getHistoryAndSetIfNeeded(container.element);

      const scrollableEdges = findScrollableEdges({ client, container });

      if (!scrollableEdges.size) {
        return;
      }

      const scrollBy = getScrollBy({
        history,
        client,
        scrollableEdges,
        timeSinceLastFrame,
      });
      container.element.scrollBy({
        ...scrollBy,
        // @ts-expect-error: unfortunately the value 'instant' is not available in TS < 5
        behavior: 'instant',
      });
    });

    // Remove history entries for scroll containers we are no longer over
    {
      const lookup: Set<Element> = new Set(
        overContainers.map(value => value.element),
      );
      engagementHistory.forEach((_, element) => {
        if (!lookup.has(element)) {
          engagementHistory.delete(element);
        }
      });
    }
  }

  function reset() {
    engagementHistory.clear();
  }

  return { scroll, reset };
}
