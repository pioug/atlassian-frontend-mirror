// Returning a `Map` as we need to do a few lookups based

import type {
  AllDragTypes,
  Position,
} from '@atlaskit/pragmatic-drag-and-drop/types';

import { defaultConfig } from '../configuration';
import type {
  Edge,
  ScrollableEdge,
  ScrollContainerArgs,
  ScrollContainerConfig,
} from '../internal-types';

const edges: Edge[] = ['top', 'right', 'bottom', 'left'];

// TODO: config
// Not letting the hitbox size grow too big for large elements
const maxHitboxSize: number = 220;

const getHitbox: {
  [Key in Edge]: (args: {
    config: ScrollContainerConfig;
    clientRect: DOMRect;
  }) => DOMRect;
} = {
  top: ({ clientRect, config }) => {
    const hitboxHeight: number = Math.min(
      config.startScrollFromPercentage.top * clientRect.height,
      maxHitboxSize,
    );

    return DOMRect.fromRect({
      x: clientRect.x,
      y: clientRect.y,
      width: clientRect.width,
      height: hitboxHeight,
    });
  },
  right: ({ clientRect, config }) => {
    const hitboxWidth: number = Math.min(
      config.startScrollFromPercentage.right * clientRect.width,
      maxHitboxSize,
    );

    return DOMRect.fromRect({
      x: clientRect.x + clientRect.width - hitboxWidth,
      y: clientRect.y,
      width: hitboxWidth,
      height: clientRect.height,
    });
  },
  bottom: ({ clientRect, config }) => {
    const hitboxHeight: number = Math.min(
      config.startScrollFromPercentage.bottom * clientRect.height,
      maxHitboxSize,
    );

    return DOMRect.fromRect({
      x: clientRect.x,
      y: clientRect.y + clientRect.height - hitboxHeight,
      width: clientRect.width,
      height: hitboxHeight,
    });
  },
  left: ({ clientRect, config }) => {
    const hitboxWidth: number = Math.min(
      config.startScrollFromPercentage.left * clientRect.width,
      maxHitboxSize,
    );

    return DOMRect.fromRect({
      x: clientRect.x,
      y: clientRect.y,
      width: hitboxWidth,
      height: clientRect.height,
    });
  },
};

function isWithin({
  client,
  clientRect,
}: {
  client: Position;
  clientRect: DOMRect;
}): boolean {
  return (
    // is within horizontal bounds
    client.x >= clientRect.x &&
    client.x <= clientRect.x + clientRect.width &&
    // is within vertical bounds
    client.y >= clientRect.y &&
    client.y <= clientRect.y + clientRect.height
  );
}

const getCanScrollOnEdge: {
  [key in Edge]: (element: Element) => boolean;
} = {
  // Notes:
  //
  // 🌏 Chrome 115.0: uses fractional units for `scrollLeft` and `scrollTop`
  //    (and fractional units don't reach true integer maximum when zoomed in / out)
  // 🍎 Safari 16.5.2: no fractional units
  // 🦊 Firefox 115.0: no fractional units

  // we have some scroll we can move backwards into
  top: element => element.scrollTop > 0,
  // We have some scroll we can move forward into
  right: element =>
    Math.ceil(element.scrollLeft) + element.clientWidth < element.scrollWidth,
  // We have some scroll we can move forwards into
  bottom: element =>
    Math.ceil(element.scrollTop) + element.clientHeight < element.scrollHeight,
  // we have some scroll we can move back into.
  left: element => element.scrollLeft > 0,
};

// on the result, and scrollable edge order is not important
export function findScrollableEdges<DragType extends AllDragTypes>({
  client,
  container,
}: {
  client: Position;
  container: ScrollContainerArgs<DragType>;
}): Map<Edge, ScrollableEdge> {
  // TODO: pull config from item with `defaultConfig` as defaults
  const config = defaultConfig;
  const clientRect = container.element.getBoundingClientRect();

  const scrollable: ScrollableEdge[] = edges
    .map((edge): ScrollableEdge | boolean => {
      // See if we are intersecting with any hitboxes
      const hitbox = getHitbox[edge]({ clientRect, config });
      if (!isWithin({ client, clientRect: hitbox })) {
        return false;
      }

      // See if that edge can actually be scrolled
      if (!getCanScrollOnEdge[edge](container.element)) {
        return false;
      }

      return {
        edge,
        hitbox,
        clientRect,
      };
    })
    .filter((value): value is ScrollableEdge => Boolean(value));

  return new Map(scrollable.map(value => [value.edge, value]));
}
