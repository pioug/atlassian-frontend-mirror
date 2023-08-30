import type { Axis, Edge, Side } from '../../internal-types';
import { axisLookup } from '../../shared/axis';
import { defaultConfig } from '../../shared/configuration';

import { HitboxSpacing } from './types';

// Not letting the hitbox size grow too big for large elements
const maxBeforeEdgeHitboxSize: number = 220;

function makeGetHitbox({ axis, side }: { axis: Axis; side: Side }) {
  return function hitbox({
    clientRect,
    hitboxSpacing,
  }: {
    clientRect: DOMRect;
    hitboxSpacing: HitboxSpacing;
  }): {
    insideEdge: DOMRect;
    outsideEdge: DOMRect;
  } {
    const { mainAxis, crossAxis } = axisLookup[axis];
    const edge: Edge = mainAxis[side];
    const spacingForEdge = hitboxSpacing[edge];

    const mainAxisInternalHitboxSize: number = Math.min(
      // scale the size of the hitbox down for smaller elements
      defaultConfig.startHitboxAtPercentageRemainingOfElement[edge] *
        clientRect[mainAxis.size],
      // Don't let the hitbox grow too big for big elements
      maxBeforeEdgeHitboxSize,
    );

    const insideEdge = DOMRect.fromRect({
      [mainAxis.point]:
        side === 'start'
          ? // being from the start edge and grow inwards
            clientRect[mainAxis.point]
          : // being from inside the end edge and grow towards the end edge
            clientRect[mainAxis.point] +
            clientRect[mainAxis.size] -
            mainAxisInternalHitboxSize,
      [crossAxis.point]:
        clientRect[crossAxis.point] - spacingForEdge[crossAxis.start],
      [mainAxis.size]: mainAxisInternalHitboxSize,
      [crossAxis.size]:
        spacingForEdge[crossAxis.start] +
        clientRect[crossAxis.size] +
        spacingForEdge[crossAxis.end],
    });

    const outsideEdge = DOMRect.fromRect({
      [mainAxis.point]:
        side === 'start'
          ? // being from before the start edge and growing forward
            clientRect[mainAxis.point] - spacingForEdge[mainAxis.start]
          : // growing from the end edge outwards
            clientRect[mainAxis.end],
      [crossAxis.point]:
        clientRect[crossAxis.point] - spacingForEdge[crossAxis.start],
      [mainAxis.size]:
        side === 'start'
          ? spacingForEdge[mainAxis.start]
          : spacingForEdge[mainAxis.end],
      [crossAxis.size]:
        spacingForEdge[crossAxis.start] +
        clientRect[crossAxis.size] +
        spacingForEdge[crossAxis.end],
    });

    return { insideEdge, outsideEdge };
  };
}

export const getHitbox: {
  [Key in Edge]: (args: {
    clientRect: DOMRect;
    hitboxSpacing: HitboxSpacing;
  }) => {
    insideEdge: DOMRect;
    outsideEdge: DOMRect;
  };
} = {
  top: makeGetHitbox({
    axis: 'vertical',
    side: 'start',
  }),
  right: makeGetHitbox({
    axis: 'horizontal',
    side: 'end',
  }),
  bottom: makeGetHitbox({
    axis: 'vertical',
    side: 'end',
  }),
  left: makeGetHitbox({
    axis: 'horizontal',
    side: 'start',
  }),
};
