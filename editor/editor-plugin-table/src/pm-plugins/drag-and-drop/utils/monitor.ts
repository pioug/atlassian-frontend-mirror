import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { ElementEventBasePayload } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type {
  DraggableData,
  DraggableSourceData,
  DraggableTargetData,
} from '../../../types';

import { getDragBehaviour } from './getDragBehaviour';

export const getDraggableDataFromEvent = ({
  location,
  source,
}: ElementEventBasePayload): DraggableData | undefined => {
  const destination = location.current.dropTargets.at(0);
  // If no target exists at the current location, then the current draggable is not over a target or the target doesn't support
  // the current draggable.
  if (!destination) {
    return undefined;
  }

  // This is the draggable elements data
  const {
    indexes: sourceIndexes,
    type: sourceType,
    localId: sourceLocalId,
  } = source.data as DraggableSourceData;

  // This is the drop target's data
  const {
    targetIndex,
    type: targetType,
    localId: targetLocalId,
  } = destination.data as DraggableTargetData;

  // Some basic check to abort early with...
  if (
    !sourceIndexes ||
    targetIndex < 0 ||
    // abort if the type of the draggable is different to the target, for eg. rows cannot be dropped onto column targets.
    sourceType !== targetType ||
    // abort if the draggable is coming from a different table that the target is on.
    sourceLocalId !== targetLocalId
  ) {
    return undefined;
  }

  const targetClosestEdge =
    extractClosestEdge(destination.data) ??
    ((targetType === 'table-row' ? 'top' : 'left') as Edge);
  // NOTE: By default we always insert row/cols at the target index to the top/left (retrospectively of row/cols).
  // This introduces an offset in the event the drop occured closer to the bottom/right of the target. We want
  // the new target index to be 1 index higher.
  const targetOffset =
    targetClosestEdge === 'right' || targetClosestEdge === 'bottom' ? 1 : 0;

  // if the min index is greater then the target index, the then the direction of the DnD is decreasing
  // if the target is within the min/max index then we can assume that no direction exists so it will be 0.
  const srcMin = Math.min(...sourceIndexes);
  const srcMax = Math.max(...sourceIndexes);
  const direction =
    targetIndex >= srcMin && targetIndex <= srcMax
      ? 0
      : srcMin >= targetIndex
      ? -1
      : 1;

  return {
    sourceType,
    sourceLocalId,
    sourceIndexes,
    targetType,
    targetLocalId,
    targetIndex,
    targetAdjustedIndex: targetIndex + targetOffset,
    targetClosestEdge,
    targetDirection:
      targetClosestEdge === 'top' || targetClosestEdge === 'left'
        ? 'start'
        : 'end',
    direction,
    behaviour: getDragBehaviour(location.current.input),
  };
};
