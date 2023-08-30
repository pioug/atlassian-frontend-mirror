import { Position } from '@atlaskit/pragmatic-drag-and-drop/types';

import { Axis, Edge } from '../internal-types';

import { axisLookup } from './axis';
import { defaultConfig } from './configuration';
import { getPercentageInRange } from './get-percentage-in-range';
import { sideLookup } from './side';

export function getDistanceDampening({
  client,
  axis,
  edge,
  hitbox,
}: {
  client: Position;
  axis: Axis;
  edge: Edge;
  hitbox: DOMRect;
}): number {
  const { mainAxis } = axisLookup[axis];
  const side = sideLookup[edge];

  // We want to hit the max speed before the edge of the hitbox
  const maxSpeedBuffer =
    hitbox[mainAxis.size] *
    defaultConfig.maxScrollAtPercentageRemainingOfHitbox[edge];

  if (side === 'end') {
    return getPercentageInRange({
      startOfRange: hitbox[mainAxis.start],
      endOfRange: hitbox[mainAxis.end] - maxSpeedBuffer,
      value: client[mainAxis.point],
    });
  }

  // Moving towards start edge

  const raw = getPercentageInRange({
    startOfRange: hitbox[mainAxis.start] + maxSpeedBuffer,
    endOfRange: hitbox[mainAxis.end],
    value: client[mainAxis.point],
  });
  // When moving near start edge
  // - the 'end' edge is where we start scrolling
  // - the 'start' edge is where we reach max speed
  // So we need to invert the percentage when moving backwards
  return 1 - raw;
}
