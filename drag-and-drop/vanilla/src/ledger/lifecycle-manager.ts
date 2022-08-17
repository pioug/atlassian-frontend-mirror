import { bindAll } from 'bind-event-listener';

import {
  AllDragTypes,
  DragInterface,
  DragLocation,
  DragLocationHistory,
  DropTargetAPI,
  DropTargetRecord,
  EventPayloadMap,
  Input,
} from '../internal-types';
import { isLeavingWindow } from '../util/entering-and-leaving-the-window';
import { getInput } from '../util/get-input';

import { makeDispatch } from './dispatch-consumer-event';

let isActive: boolean = false;

function canStart(): boolean {
  return !isActive;
}

function getNativeSetDragImage(event: DragEvent) {
  if (event.dataTransfer) {
    // need to use `.bind` as `setDragImage` is required
    // to be run with `event.dataTransfer` as the "this" context
    return event.dataTransfer.setDragImage.bind(event.dataTransfer);
  }
  return null;
}

function hasHierarchyChanged({
  current,
  next,
}: {
  current: DropTargetRecord[];
  next: DropTargetRecord[];
}): boolean {
  if (current.length !== next.length) {
    return true;
  }
  // not checking stickiness, data or dropEffect,
  // just whether the hierarchy has changed
  for (let i = 0; i < current.length; i++) {
    if (current[i].element !== next[i].element) {
      return true;
    }
  }
  return false;
}

function start<DragType extends AllDragTypes>({
  event,
  dragInterface,
  getDropTargetsOver,
  dispatchEvent,
}: {
  event: DragEvent;
  dragInterface: DragInterface<DragType>;
  getDropTargetsOver: DropTargetAPI<DragType>['getIsOver'];
  dispatchEvent: <EventName extends keyof EventPayloadMap<DragType>>(args: {
    eventName: EventName;
    payload: EventPayloadMap<DragType>[EventName];
  }) => void;
}): void {
  if (!canStart()) {
    return;
  }
  isActive = true;

  const initial: DragLocation = getStartLocation({
    event,
    dragInterface,
    getDropTargetsOver,
  });
  let state: DragLocationHistory = {
    initial,
    current: initial,
    // no 'previous' when we first start dragging
    previous: { dropTargets: [] },
  };
  function updateState({ next }: { next: DragLocation }): void {
    const newState: Readonly<DragLocationHistory> = {
      initial,
      previous: {
        dropTargets: state.current.dropTargets,
      },
      current: next,
    };
    state = newState;
  }

  setDropEffect({ event, current: state.initial.dropTargets });

  const dispatch = makeDispatch<DragType>({
    source: dragInterface.payload,
    dispatchEvent,
  });

  function updateDropTargets(next: DragLocation) {
    // only looking at whether hierarchy has changed to determine whether something as 'changed'
    const hasChanged = hasHierarchyChanged({
      current: state.current.dropTargets,
      next: next.dropTargets,
    });

    // Always updating the state to include latest data, dropEffect and stickiness
    // Only updating consumers if the hierarchy has changed in some way
    // Consumers can get the latest data by using `onDrag`
    updateState({ next });

    if (hasChanged) {
      dispatch.dragUpdate({
        location: state,
      });
    }
  }

  function onUpdateEvent(event: DragEvent) {
    const input: Input = getInput(event);

    const nextDropTargets = getDropTargetsOver({
      target: event.target,
      input,
      source: dragInterface.payload,
      current: state.current.dropTargets,
    });

    if (nextDropTargets.length) {
      // 🩸 must call `event.preventDefault()` to allow a browser drop to occur
      event.preventDefault();

      setDropEffect({ event, current: nextDropTargets });
    }

    updateDropTargets({ dropTargets: nextDropTargets, input });
  }

  function cancel() {
    // The spec behaviour is that when a drop is cancelled,
    // a 'dragleave' event is fired on the active drop target
    // before a `dragend` event.
    // We are replicating that behaviour here

    // If there are any active drop targets we will create
    // and update event to leave them
    if (state.current.dropTargets.length) {
      updateState({
        next: {
          // clear the drop targets
          dropTargets: [],
          // keep the same input
          input: state.current.input,
        },
      });

      dispatch.dragUpdate({
        location: state,
      });
    }

    dispatch.drop({
      location: state,
      updatedExternalPayload: null,
    });

    finish();
  }

  function finish() {
    isActive = false;
    unbindEvents();
  }

  const unbindEvents = bindAll(window, [
    {
      // 👋 Note: we are repurposing the `dragover` event as our `drag` event
      // this is because firefox does not publish pointer coordinates during
      // a `drag` event, but does for every other type of drag event
      // `dragover` fires on all elements that are being dragged over
      // Because we are binding to `window` - our `dragover` is effectively the same as a `drag`
      // 🦊😤
      type: 'dragover',
      listener(event: DragEvent) {
        // We need to regularly calculate the drop targets in order to allow:
        //  - dynamic `canDrop()` checks
        //  - rapid updating `getData()` calls to attach data in response to user input (eg for edge detection)
        // Sadly we cannot schedule inspecting changes resulting from this event
        // we need to be able to conditionally cancel the event with `event.preventDefault()`
        // to enable the correct native drop experience.

        // 1. check to see if anything has changed
        onUpdateEvent(event);

        // 2. let consumers know a move has occurred
        dispatch.drag({
          location: state,
        });
      },
    },
    {
      type: 'dragenter',
      listener: onUpdateEvent,
    },
    {
      // This was the only reliable cross browser way I found to detect
      // when the user is leaving the `window`.
      // When we leave the `window` we want to clear any active drop targets,
      // but the drag is not yet over. The user could drag back into the window.
      // We only need to do this because of stickiness
      type: 'dragleave',
      listener(event: DragEvent) {
        if (!isLeavingWindow({ dragLeave: event })) {
          return;
        }
        updateDropTargets({ input: getInput(event), dropTargets: [] });
        if (dragInterface.startedFrom === 'external') {
          cancel();
        }
      },
    },
    {
      type: 'drop',
      listener(event: DragEvent) {
        // this can only happen if the browser allowed the drop

        if (dragInterface.startedFrom === 'external') {
          dragInterface.key;
        }

        // Opting out of standard browser drop behaviour for the drag
        event.preventDefault();

        // applying the latest drop effect to the event
        setDropEffect({ event, current: state.current.dropTargets });

        dispatch.drop({
          location: state,
          updatedExternalPayload:
            dragInterface.startedFrom === 'external'
              ? // This type is correctly narrowed in TS4.7
                // But is not narrowing correctly in TS4.2
                // @ts-expect-error
                dragInterface.getDropPayload?.(event) || null
              : null,
        });

        finish();
      },
    },
    {
      // "dragend" fires when on the drag source (eg a draggable element)
      // when the drag is finished.
      // "dragend" will fire after "drop"(if there was a successful drop)
      // "dragend" does not fire if the draggable source has been removed during the drag
      // or for external drag sources (eg files)
      type: 'dragend',
      listener: cancel,
    },
    // ## Detecting drag ending for removed draggables
    //
    // If a draggable element is removed during a drag and the user drops:
    // 1. if over a valid drop target: we get a "drop" event to know the drag is finished
    // 2. if not over a valid drop target (or cancelled): we get nothing
    // The "dragend" event will not fire on the source draggable if it has been
    // removed from the DOM.
    // So we need to figure out if a drag operation has finished by looking at other events
    // We can do this by looking at other events

    // ### First detection: "pointermove" events

    // 1. "pointermove" events cannot fire during a drag and drop operation
    // according to the spec. So if we get a "pointermove" it means that
    // the drag and drop operations has finished. So if we get a "pointermove"
    // we know that the drag is over
    // 2. 🦊😤 Drag and drop operations are _supposed_ to suppress
    // other pointer events. However, firefox will allow a few
    // pointer event to get through after a drag starts.
    // The most I've seen is 3
    {
      type: 'pointermove',
      listener: (() => {
        let callCount: number = 0;
        return function listener() {
          // Using 20 as it is far bigger than the most observed (3)
          if (callCount < 20) {
            callCount++;
            return;
          }
          cancel();
        };
      })(),
    },

    // ### Second detection: "pointerdown" events

    // If we receive this event then we know that a drag operation has finished
    // and potentially another one is about to start.
    // Note: `pointerdown` fires on all browsers / platforms before "dragstart"
    {
      type: 'pointerdown',
      listener: cancel,
    },
  ]);

  dispatch.start({
    location: state,
    nativeSetDragImage: getNativeSetDragImage(event),
  });
}

function setDropEffect({
  event,
  current,
}: {
  event: DragEvent;
  current: DropTargetRecord[];
}) {
  // setting the `dropEffect` to be the innerMost drop targets dropEffect
  const innerMost = current[0]?.dropEffect;
  if (innerMost != null && event.dataTransfer) {
    event.dataTransfer.dropEffect = innerMost;
  }
}

function getStartLocation<DragType extends AllDragTypes>({
  event,
  dragInterface,
  getDropTargetsOver,
}: {
  event: DragEvent;
  dragInterface: DragInterface<DragType>;
  getDropTargetsOver: DropTargetAPI<DragType>['getIsOver'];
}): DragLocation {
  const input: Input = getInput(event);

  // When dragging from outside of the browser, we don't have any starting drop targets
  if (dragInterface.startedFrom === 'external') {
    return {
      input,
      dropTargets: [],
    };
  }

  const dropTargets: DropTargetRecord[] = getDropTargetsOver({
    input,
    source: dragInterface.payload,
    target: event.target,
    current: [],
  });
  return {
    input,
    dropTargets,
  };
}

export const lifecycle = {
  canStart,
  start,
};
