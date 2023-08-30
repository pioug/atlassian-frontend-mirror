import type { Position } from '@atlaskit/pragmatic-drag-and-drop/types';

import { markAndGetEngagement } from '../../engagement-history';
import { Behavior, Edge } from '../../internal-types';
import { canScrollOnEdge } from '../../shared/can-scroll-on-edge';
import { isWithin } from '../../shared/is-within';

import { getScrollBy } from './get-scroll-by';
import { getHitbox } from './hitbox';
import { HitboxForEdge, HitboxSpacing } from './types';

const edges: Edge[] = ['top', 'right', 'bottom', 'left'];

export function unsafeOverflow({
  getHitboxSpacing,
}: {
  getHitboxSpacing: () => HitboxSpacing;
}): Behavior {
  function onFrame({
    element,
    input,
    timeSinceLastFrame,
  }: Parameters<Behavior['onFrame']>[0]) {
    const hitboxSpacing = getHitboxSpacing();
    const client: Position = {
      x: input.clientX,
      y: input.clientY,
    };
    // 🔥
    // For each registered item we need to do `getBoundingClientRect()` which is not great
    // Why?
    // 1. The hitbox can extend outside of an elements bounds
    // 2. We want overflow scrolling to start before the user has entered the bounds of the element
    //     Otherwise we could search upwards in the DOM from the `elementFromPoint`
    const clientRect: DOMRect = element.getBoundingClientRect();

    const inHitboxOnEdge: HitboxForEdge[] = edges
      .map((edge): HitboxForEdge | false => {
        const { insideEdge, outsideEdge } = getHitbox[edge]({
          clientRect,
          hitboxSpacing,
        });

        const isInsideEdge = isWithin({ client, clientRect: insideEdge });
        const isOutsideEdge = isWithin({ client, clientRect: outsideEdge });

        if (!isInsideEdge && !isOutsideEdge) {
          return false;
        }

        return {
          outsideEdge,
          insideEdge,
          edge,
          isWithin: isInsideEdge ? 'inside-edge' : 'outside-edge',
        };
      })
      .filter((value): value is HitboxForEdge => Boolean(value));

    if (!inHitboxOnEdge.length) {
      return;
    }

    // Okay, we are in the hitbox for at least one hitbox,
    // even if we cannot scroll on that edge
    // We can mark this as being engaged with
    const engagement = markAndGetEngagement(element);

    // Now we can check to see if any edge of the scroll container
    // are actually scrollable
    const scrollableEdges: HitboxForEdge[] = inHitboxOnEdge.filter(value => {
      return canScrollOnEdge[value.edge](element);
    });

    if (!scrollableEdges.length) {
      return;
    }

    const scrollBy = getScrollBy({
      scrollableEdges,
      engagement,
      timeSinceLastFrame,
      client,
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
