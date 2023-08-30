import type { Position } from '@atlaskit/pragmatic-drag-and-drop/types';

import type { Axis, Edge, EngagementHistoryEntry } from '../../internal-types';
import { getDistanceDampening } from '../../shared/get-distance-dampening';
import { getPercentageInRange } from '../../shared/get-percentage-in-range';
import { sideLookup } from '../../shared/side';

import { HitboxForEdge } from './types';

const maxScrollPerSecond: number = 60 * 15;
const timeDampeningDuration = 300;

function getSpeed({
  client,
  timeSinceLastFrame,
  engagement,
  axis,
  scrollableEdge,
}: {
  timeSinceLastFrame: number;
  scrollableEdge: HitboxForEdge;
  axis: Axis;
  engagement: EngagementHistoryEntry;
  client: Position;
}): number {
  // We want a consistent scroll speed across devices, regardless of framerate
  const maxScroll = Math.min(
    // Pull the scroll speed down on high frame rate devices
    // 60fps and 120fps devices will get the same scroll speed per second
    Math.round((maxScrollPerSecond / 1000) * timeSinceLastFrame),
    // For devices with lower frame rates (or struggling devices)
    // we don't want to have large scroll changes.
    // So we will make the max scroll what it would have been if there was 60fps.
    maxScrollPerSecond / 60,
  );

  const { edge, insideEdge, isWithin } = scrollableEdge;

  const percentageDistanceDampening: number = (() => {
    if (isWithin === 'outside-edge') {
      return 1;
    }
    return getDistanceDampening({
      client,
      edge,
      hitbox: insideEdge,
      axis,
    });
  })();

  // Dampen speed by time
  const percentageThroughTimeDampening = getPercentageInRange({
    startOfRange: engagement.timeOfEngagementStart,
    endOfRange: engagement.timeOfEngagementStart + timeDampeningDuration,
    value: Date.now(),
  });

  const speed =
    maxScroll * percentageThroughTimeDampening * percentageDistanceDampening;

  const side = sideLookup[edge];

  // When moving backwards, we will be scrolling backwards
  return side === 'end' ? speed : -1 * speed;
}

export function getScrollBy({
  scrollableEdges,
  engagement,
  timeSinceLastFrame,
  client,
}: {
  client: Position;
  engagement: EngagementHistoryEntry;
  scrollableEdges: HitboxForEdge[];
  timeSinceLastFrame: number;
}): Pick<ScrollToOptions, 'top' | 'left'> {
  const lookup = new Map<Edge, HitboxForEdge>(
    scrollableEdges.map(value => [value.edge, value]),
  );

  const left: number = (() => {
    const leftEdge = lookup.get('left');
    if (leftEdge) {
      return getSpeed({
        client,
        scrollableEdge: leftEdge,
        axis: 'horizontal',
        timeSinceLastFrame,
        engagement,
      });
    }
    const rightEdge = lookup.get('right');
    if (rightEdge) {
      return getSpeed({
        client,
        scrollableEdge: rightEdge,
        axis: 'horizontal',
        timeSinceLastFrame,
        engagement,
      });
    }

    return 0;
  })();

  const top: number = (() => {
    const bottomEdge = lookup.get('bottom');
    if (bottomEdge) {
      return getSpeed({
        client,
        scrollableEdge: bottomEdge,
        axis: 'vertical',
        timeSinceLastFrame,
        engagement,
      });
    }
    const topEdge = lookup.get('top');
    if (topEdge) {
      return getSpeed({
        client,
        scrollableEdge: topEdge,
        axis: 'vertical',
        timeSinceLastFrame,
        engagement,
      });
    }

    return 0;
  })();

  return {
    left,
    top,
  };
}
