import type { Position } from '@atlaskit/pragmatic-drag-and-drop/types';

import { defaultConfig } from '../configuration';
import type {
  Edge,
  EngagementHistoryEntry,
  ScrollableEdge,
} from '../internal-types';

// TODO: config
const maxScrollPerSecond: number = 60 * 15;
const timeDampeningDuration = 300;

type Axis = 'vertical' | 'horizontal';

const axisLookup: {
  [Key in Axis]: {
    start: Edge;
    end: Edge;
    point: 'x' | 'y';
    size: 'width' | 'height';
  };
} = {
  vertical: {
    start: 'top',
    end: 'bottom',
    point: 'y',
    size: 'height',
  },
  horizontal: {
    start: 'left',
    end: 'right',
    point: 'x',
    size: 'width',
  },
};

function getPercentageInRange({
  startOfRange,
  endOfRange,
  value,
}: {
  startOfRange: number;
  endOfRange: number;
  value: number;
}): number {
  // invalidating inputs
  const isValid: boolean = startOfRange < endOfRange;

  if (!isValid) {
    return 0;
  }

  if (value < startOfRange) {
    return 0;
  }
  if (value > endOfRange) {
    return 1;
  }

  const range: number = endOfRange - startOfRange;
  return (value - startOfRange) / range;
}

function getSpeed({
  client,
  scrollableEdge,
  axis,
  direction,
  history,
  timeSinceLastFrame,
}: {
  client: Position;
  scrollableEdge: ScrollableEdge;
  axis: Axis;
  direction: 'forward' | 'backward';
  history: EngagementHistoryEntry;
  timeSinceLastFrame: number;
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

  const axisValue = axisLookup[axis];

  // We have two forms of speed dampening:
  // 1. 🗺️ Distance
  // The closer you are to a hitbox edge, the faster the scroll speed will be
  // 2. ⏱️ Time
  // When first entering a scroll container we want to dampening all scrolling
  // This is to prevent super fast auto scrolling when first entering into
  // a scroll container, or when lifting in a scroll container

  const percentageDistanceDampening: number = (() => {
    // We want to hit the max speed before the edge of the hitbox
    const maxSpeedBuffer =
      scrollableEdge.hitbox[axisValue.size] *
      defaultConfig.maxScrollAtPercentageRemainingOfHitbox[scrollableEdge.edge];

    if (direction === 'forward') {
      return getPercentageInRange({
        startOfRange: scrollableEdge.hitbox[axisValue.start],
        endOfRange: scrollableEdge.hitbox[axisValue.end] - maxSpeedBuffer,
        value: client[axisValue.point],
      });
    }

    // Moving backwards

    const raw = getPercentageInRange({
      startOfRange: scrollableEdge.hitbox[axisValue.start] + maxSpeedBuffer,
      endOfRange: scrollableEdge.hitbox[axisValue.end],
      value: client[axisValue.point],
    });
    // When moving backwards
    // - the 'end' edge is where we start scrolling
    // - the 'start' edge is where we reach max speed
    // So we need to invert the percentage when moving backwards
    return 1 - raw;
  })();

  // Dampen speed by time
  const percentageThroughTimeDampening = getPercentageInRange({
    startOfRange: history.timeOfEngagementStart,
    endOfRange: history.timeOfEngagementStart + timeDampeningDuration,
    value: Date.now(),
  });

  // Calculate how much of the max scroll we should apply based on dampening
  const percentageOfMaxSpeed =
    percentageDistanceDampening * percentageThroughTimeDampening;

  // We _could_ ease this update (`Math.pow(percentageOfMaxSpeed, 2)`)
  // But linear is feeling really good
  const speed = maxScroll * percentageOfMaxSpeed;

  // When moving backwards, we will be scrolling backwards
  return direction === 'forward' ? speed : -1 * speed;
}

export function getScrollBy({
  client,
  scrollableEdges,
  history,
  timeSinceLastFrame,
}: {
  client: Position;
  history: EngagementHistoryEntry;
  scrollableEdges: Map<Edge, ScrollableEdge>;
  timeSinceLastFrame: number;
}): Pick<ScrollToOptions, 'top' | 'left'> {
  const left: number = (() => {
    const leftEdge = scrollableEdges.get('left');
    if (leftEdge) {
      return getSpeed({
        client,
        scrollableEdge: leftEdge,
        direction: 'backward',
        axis: 'horizontal',
        history,
        timeSinceLastFrame,
      });
    }
    const rightEdge = scrollableEdges.get('right');
    if (rightEdge) {
      return getSpeed({
        client,
        scrollableEdge: rightEdge,
        direction: 'forward',
        axis: 'horizontal',
        history,
        timeSinceLastFrame,
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
        direction: 'forward',
        axis: 'vertical',
        history,
        timeSinceLastFrame,
      });
    }
    const topEdge = scrollableEdges.get('top');
    if (topEdge) {
      return getSpeed({
        client,
        scrollableEdge: topEdge,
        direction: 'backward',
        axis: 'vertical',
        history,
        timeSinceLastFrame,
      });
    }

    return 0;
  })();

  return {
    left,
    top,
  };
}
