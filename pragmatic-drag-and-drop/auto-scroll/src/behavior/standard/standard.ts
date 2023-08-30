import type { Position } from '@atlaskit/pragmatic-drag-and-drop/types';

import { markAndGetEngagement } from '../../engagement-history';
import { Behavior, Edge } from '../../internal-types';
import { canScrollOnEdge } from '../../shared/can-scroll-on-edge';
import { isWithin } from '../../shared/is-within';

import { getScrollBy } from './get-scroll-by';
import { getHitbox } from './hitbox';
import type { ScrollableEdge } from './types';

const edges: Edge[] = ['top', 'right', 'bottom', 'left'];

export function standard(): Behavior {
  function onFrame({
    element,
    input,
    timeSinceLastFrame,
  }: Parameters<Behavior['onFrame']>[0]) {
    const client: Position = {
      x: input.clientX,
      y: input.clientY,
    };
    const underUsersPointer = document.elementFromPoint(client.x, client.y);

    // nothing to do
    if (!element.contains(underUsersPointer)) {
      return;
    }

    const clientRect: DOMRect = element.getBoundingClientRect();

    // Note: marking engagement even if there are no scrollable edges.
    // ⏱️ We apply time dampening as soon as the user is over an element
    // We don't want the scroll speed to be fast when:
    // - When starting inside a scrollable element
    // - When entering a scrollable element
    // If a user has been over an element for a short period of time,
    // we no longer want to dampen their scroll speed by time.
    const engagement = markAndGetEngagement(element);

    const scrollableEdges: Map<Edge, ScrollableEdge> = edges.reduce(
      (map, edge) => {
        const hitbox = getHitbox[edge]({ clientRect });

        if (!isWithin({ client, clientRect: hitbox })) {
          return map;
        }
        if (!canScrollOnEdge[edge](element)) {
          return map;
        }

        map.set(edge, { edge, hitbox });
        return map;
      },
      new Map<Edge, ScrollableEdge>(),
    );

    if (!scrollableEdges.size) {
      return;
    }

    const scrollBy = getScrollBy({
      client,
      scrollableEdges,
      engagement,
      timeSinceLastFrame,
    });

    element.scrollBy({
      ...scrollBy,
      // @ts-expect-error: TS < 5 does not include 'behavior'
      behavior: 'instant',
    });
  }

  return {
    onFrame,
    // TODO: do we need cleanup?
    cleanup: () => {},
  };
}
