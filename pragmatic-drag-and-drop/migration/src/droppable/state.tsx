import type {
  DraggableLocation,
  DragStart,
  DragUpdate,
  DroppableId,
} from 'react-beautiful-dnd';

import type { Action } from '../internal-types';

type DroppableState = {
  draggingFromThisWith: string | null;
  draggingOverWith: string | null;
  isDraggingOver: boolean;
  source: DraggableLocation | null;
  destination: DraggableLocation | null;
  targetLocation: DraggableLocation | null;
};

export type DroppableAction =
  | Action<'DRAG_START', { droppableId: DroppableId; start: DragStart }>
  | Action<
      'DRAG_UPDATE',
      {
        droppableId: DroppableId;
        targetLocation: DraggableLocation | null;
        update: DragUpdate;
      }
    >
  | Action<'DRAG_CLEAR'>;

export const idleState: DroppableState = {
  draggingFromThisWith: null,
  draggingOverWith: null,
  isDraggingOver: false,
  source: null,
  destination: null,
  targetLocation: null,
};

export function reducer(
  state: DroppableState,
  action: DroppableAction,
): DroppableState {
  if (action.type === 'DRAG_START') {
    const { droppableId, start } = action.payload;
    const { draggableId, source } = start;

    const isDraggingOver = source.droppableId === droppableId;
    const draggingOverWith = isDraggingOver ? draggableId : null;

    const isDraggingFrom = source.droppableId === droppableId;
    const draggingFromThisWith = isDraggingFrom ? draggableId : null;

    return {
      ...state,
      isDraggingOver,
      draggingFromThisWith,
      draggingOverWith,
      source: start.source,
      destination: start.source,
      targetLocation: start.source,
    };
  }

  if (action.type === 'DRAG_UPDATE') {
    const { droppableId, targetLocation, update } = action.payload;
    const { destination = null, draggableId, source } = update;

    const isDraggingOver = destination?.droppableId === droppableId;
    const draggingOverWith = isDraggingOver ? draggableId : null;

    const isDraggingFrom = source.droppableId === droppableId;
    const draggingFromThisWith = isDraggingFrom ? draggableId : null;

    return {
      ...state,
      isDraggingOver,
      draggingFromThisWith,
      draggingOverWith,
      source: update.source,
      destination,
      targetLocation,
    };
  }

  if (action.type === 'DRAG_CLEAR') {
    return idleState;
  }

  return state;
}
