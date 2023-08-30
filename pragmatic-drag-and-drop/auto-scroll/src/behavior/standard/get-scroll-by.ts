import type { Position } from '@atlaskit/pragmatic-drag-and-drop/types';

import type { Axis, Edge, EngagementHistoryEntry } from '../../internal-types';
import { getDistanceDampening } from '../../shared/get-distance-dampening';
import { getPercentageInRange } from '../../shared/get-percentage-in-range';
import { sideLookup } from '../../shared/side';

import type { ScrollableEdge } from './types';

const maxScrollPerSecond: number = 60 * 15;
const timeDampeningDuration = 300;

function getSpeed({
  client,
  scrollableEdge,
  axis,
  timeSinceLastFrame,
  engagement,
}: {
  client: Position;
  scrollableEdge: ScrollableEdge;
  axis: Axis;
  timeSinceLastFrame: number;
  engagement: EngagementHistoryEntry;
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

  // We have two forms of speed dampening:
  // 1. 🗺️ Distance
  // The closer you are to a hitbox edge, the faster the scroll speed will be
  // 2. ⏱️ Time
  // When first entering a scroll container we want to dampening all scrolling
  // This is to prevent super fast auto scrolling when first entering into
  // a scroll container, or when lifting in a scroll container

  const { hitbox, edge } = scrollableEdge;

  const percentageDistanceDampening: number = getDistanceDampening({
    axis,
    client,
    hitbox,
    edge,
  });

  // Dampen speed by time
  const percentageThroughTimeDampening = getPercentageInRange({
    startOfRange: engagement.timeOfEngagementStart,
    endOfRange: engagement.timeOfEngagementStart + timeDampeningDuration,
    value: Date.now(),
  });

  // eslint-disable-next-line no-console
  console.log({ percentageDistanceDampening, percentageThroughTimeDampening });

  // Calculate how much of the max scroll we should apply based on dampening
  const percentageOfMaxSpeed =
    percentageDistanceDampening * percentageThroughTimeDampening;

  // We _could_ ease this update (`Math.pow(percentageOfMaxSpeed, 2)`)
  // But linear is feeling really good
  const speed = maxScroll * percentageOfMaxSpeed;

  const side = sideLookup[edge];

  // When moving backwards, we will be scrolling backwards
  return side === 'end' ? speed : -1 * speed;
}

export function getScrollBy({
  client,
  scrollableEdges,
  engagement,
  timeSinceLastFrame,
}: {
  client: Position;
  engagement: EngagementHistoryEntry;
  scrollableEdges: Map<Edge, ScrollableEdge>;
  timeSinceLastFrame: number;
}): Pick<ScrollToOptions, 'top' | 'left'> {
  const left: number = (() => {
    const leftEdge = scrollableEdges.get('left');
    if (leftEdge) {
      return getSpeed({
        client,
        scrollableEdge: leftEdge,
        axis: 'horizontal',
        timeSinceLastFrame,
        engagement,
      });
    }
    const rightEdge = scrollableEdges.get('right');
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
    const bottomEdge = scrollableEdges.get('bottom');
    if (bottomEdge) {
      return getSpeed({
        client,
        scrollableEdge: bottomEdge,
        axis: 'vertical',
        timeSinceLastFrame,
        engagement,
      });
    }
    const topEdge = scrollableEdges.get('top');
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
