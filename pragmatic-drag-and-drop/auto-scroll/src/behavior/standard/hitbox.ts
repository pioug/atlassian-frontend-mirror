// TODO: config

import type { Axis, Edge, Side } from '../../internal-types';
import { axisLookup } from '../../shared/axis';
import { defaultConfig } from '../../shared/configuration';
import { sideLookup } from '../../shared/side';

// Not letting the hitbox size grow too big for large elements
const maxMainAxisHitboxSize: number = 220;

function makeGetHitbox({ edge, axis }: { edge: Edge; axis: Axis }) {
  return function hitbox({ clientRect }: { clientRect: DOMRect }) {
    const { mainAxis, crossAxis } = axisLookup[axis];
    const side: Side = sideLookup[edge];

    const mainAxisHitboxSize: number = Math.min(
      // scale the size of the hitbox down for smaller elements
      defaultConfig.startHitboxAtPercentageRemainingOfElement[edge] *
        clientRect[mainAxis.size],
      // Don't let the hitbox grow too big for big elements
      maxMainAxisHitboxSize,
    );

    return DOMRect.fromRect({
      [mainAxis.point]:
        side === 'start'
          ? // begin from the start edge and grow inwards
            clientRect[mainAxis.point]
          : // begin from inside the end edge and grow towards the end edge
            clientRect[mainAxis.point] +
            clientRect[mainAxis.size] -
            mainAxisHitboxSize,
      [crossAxis.point]: clientRect[crossAxis.point],
      [mainAxis.size]: mainAxisHitboxSize,
      [crossAxis.size]: clientRect[crossAxis.size],
    });
  };
}

export const getHitbox: {
  [Key in Edge]: (args: { clientRect: DOMRect }) => DOMRect;
} = {
  top: makeGetHitbox({
    axis: 'vertical',
    edge: 'top',
  }),
  right: makeGetHitbox({
    axis: 'horizontal',
    edge: 'right',
  }),
  bottom: makeGetHitbox({
    axis: 'vertical',
    edge: 'bottom',
  }),
  left: makeGetHitbox({
    axis: 'horizontal',
    edge: 'left',
  }),
};
