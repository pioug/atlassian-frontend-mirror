import { reorder } from '@atlaskit/drag-and-drop/util/reorder';

import type { Edge } from './types';

export function reorderWithEdge<Value>({
  edge,
  list,
  startIndex,
  finishIndex,
  axis,
}: {
  edge: Edge | null;
  list: Value[];
  startIndex: number;
  finishIndex: number;
  axis: 'vertical' | 'horizontal';
}): Value[] {
  // invalid index's
  if (startIndex === -1 || finishIndex === -1) {
    return list;
  }

  // if we are targeting the same index we don't need to do anything
  if (startIndex === finishIndex) {
    return list;
  }

  const destinationIndex: number = (() => {
    if (edge == null) {
      return finishIndex;
    }
    const isGoingAfter: boolean =
      (axis === 'vertical' && edge === 'bottom') ||
      (axis === 'horizontal' && edge === 'right');

    const isMovingForward: boolean = startIndex < finishIndex;
    // moving forward
    if (isMovingForward) {
      return isGoingAfter ? finishIndex : finishIndex - 1;
    }
    // moving backwards
    return isGoingAfter ? finishIndex + 1 : finishIndex;
  })();

  return reorder({ list, startIndex, finishIndex: destinationIndex });
}
