import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import type { ElementEventBasePayload } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import type {
  DraggableData,
  DraggableSourceData,
  DraggableTargetData,
} from '../../../types';

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

  // FIXME: currently we only support a single row/col index being moved, remove this clause when this is no longer the case.
  if (sourceIndexes.length > 1) {
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

  return {
    sourceType,
    sourceLocalId,
    sourceIndexes,
    targetType,
    targetLocalId,
    targetIndex,
    targetAdjustedIndex: targetIndex + targetOffset,
    targetClosestEdge,
  };
};
