import { bindAll } from 'bind-event-listener';

import {
  AllDragTypes,
  DragLocation,
  DropTargetAPI,
  DropTargetRecord,
  EventPayloadMap,
  Input,
} from '../internal-types';
import { isLeavingWindow } from '../util/changing-window/is-leaving-window';
import { getBindingsForBrokenDrags } from '../util/detect-broken-drag';
import { fixPostDragPointerBug } from '../util/fix-post-drag-pointer-bug';
import { getInput } from '../util/get-input';

import { makeDispatch } from './dispatch-consumer-event';

let isActive: boolean = false;

function canStart(): boolean {
  return !isActive;
}

function getNativeSetDragImage(
  event: DragEvent,
): DataTransfer['setDragImage'] | null {
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
  dragType,
  getDropTargetsOver,
  dispatchEvent,
}: {
  event: DragEvent;
  dragType: DragType;
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
    dragType,
    getDropTargetsOver,
  });
  let current: DragLocation = initial;
  // Setting initial drop effect for the drag
  setDropEffect({ event, current: initial.dropTargets });

  const dispatch = makeDispatch<DragType>({
    source: dragType.payload,
    dispatchEvent,
    initial,
  });

  function updateDropTargets(next: DragLocation) {
    // only looking at whether hierarchy has changed to determine whether something as 'changed'
    const hasChanged = hasHierarchyChanged({
      current: current.dropTargets,
      next: next.dropTargets,
    });

    // Always updating the state to include latest data, dropEffect and stickiness
    // Only updating consumers if the hierarchy has changed in some way
    // Consumers can get the latest data by using `onDrag`
    current = next;

    if (hasChanged) {
      dispatch.dragUpdate({
        current,
      });
    }
  }

  function onUpdateEvent(event: DragEvent) {
    const input: Input = getInput(event);

    const nextDropTargets = getDropTargetsOver({
      target: event.target,
      input,
      source: dragType.payload,
      current: current.dropTargets,
    });

    if (nextDropTargets.length) {
      // 🩸 must call `event.preventDefault()` to allow a browser drop to occur
      event.preventDefault();

      setDropEffect({ event, current: nextDropTargets });
    }

    updateDropTargets({ dropTargets: nextDropTargets, input });
  }

  function onDrop(
    args: { type: 'success'; event: DragEvent } | { type: 'cancel' },
  ) {
    // When dropping something native, we need to extract the latest
    // `.items` from the "drop" event as it is now accessible
    if (args.type === 'success' && dragType.type === 'external') {
      dispatch.drop({
        current,
        updatedSourcePayload: dragType.getDropPayload(args.event),
      });
      return;
    }

    dispatch.drop({
      current,
      updatedSourcePayload: null,
    });
  }

  function cancel() {
    // The spec behaviour is that when a drag is cancelled, or when dropping on no drop targets,
    // a "dragleave" event is fired on the active drop target before a "dragend" event.
    // We are replicating that behaviour in `cancel` if there are any active drop targets to
    // ensure consistent behaviour.
    //
    // Note: When cancelling, or dropping on no drop targets, a "dragleave" event
    // will have already cleared the dropTargets to `[]` (as that particular "dragleave" has a `relatedTarget` of `null`)

    if (current.dropTargets.length) {
      updateDropTargets({ dropTargets: [], input: current.input });
    }
    onDrop({ type: 'cancel' });

    finish();
  }

  function finish() {
    isActive = false;
    unbindEvents();
  }

  const unbindEvents = bindAll(
    window,
    [
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
          // This will include the latest 'input' values
          dispatch.drag({
            current,
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
        // Internal drags: when we leave the `window` we want to clear any active drop targets,
        // but the drag is not yet over. The user could drag back into the window.
        // We only need to do this because of stickiness
        // External drags: when we leave the `window` the drag operation is over,
        // we will start another drag operation
        type: 'dragleave',
        listener(event: DragEvent) {
          if (!isLeavingWindow({ dragLeave: event })) {
            return;
          }

          // When a drag is ending without a drop target (or when the drag is cancelled),
          // All browsers fire:
          // 1. "drag"
          // 2. "dragleave"
          // These events have `event.relatedTarget == null` so this code path is also hit in those cases.
          // This is all good! We would be clearing the dropTargets in `cancel()` after the "dragend"

          // 🐛 Bug workaround: intentionally not updating `input` in "dragleave"
          // In Chrome, this final "dragleave" has default input values (eg clientX == 0)
          // rather than the users current input values
          //
          // - [Conversation](https://twitter.com/alexandereardon/status/1642697633864241152)
          // - [Bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1429937)
          updateDropTargets({ input: current.input, dropTargets: [] });

          // End the drag operation if a native drag is leaving the window
          if (dragType.startedFrom === 'external') {
            cancel();
          }
        },
      },
      {
        type: 'drop',
        listener(event: DragEvent) {
          // A "drop" can only happen if the browser allowed the drop

          // Opting out of standard browser drop behaviour for the drag
          event.preventDefault();

          // applying the latest drop effect to the event
          setDropEffect({ event, current: current.dropTargets });

          onDrop({ type: 'success', event });

          finish();

          // Applying this fix after `dispatch.drop` so that frameworks have the opportunity
          // to update UI in response to a "onDrop".
          if (dragType.startedFrom === 'internal') {
            fixPostDragPointerBug({ current });
          }
        },
      },
      {
        // "dragend" fires when on the drag source (eg a draggable element)
        // when the drag is finished.
        // "dragend" will fire after "drop"(if there was a successful drop)
        // "dragend" does not fire if the draggable source has been removed during the drag
        // or for external drag sources (eg files)
        type: 'dragend',
        listener() {
          cancel();

          // Applying this fix after `dispatch.drop` so that frameworks have the opportunity
          // to update UI in response to a "onDrop".
          if (dragType.startedFrom === 'internal') {
            fixPostDragPointerBug({ current });
          }
        },
      },
      ...getBindingsForBrokenDrags({ onDragEnd: cancel }),
    ],
    // Once we have started a managed drag operation it is important that we see / own all drag events
    // We got one adoption bug pop up where some code was stopping (`event.stopPropagation()`)
    // all "drop" events in the bubble phase on the `document.body`.
    // This meant that we never saw the "drop" event.
    { capture: true },
  );

  dispatch.start({
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
  dragType,
  getDropTargetsOver,
}: {
  event: DragEvent;
  dragType: DragType;
  getDropTargetsOver: DropTargetAPI<DragType>['getIsOver'];
}): DragLocation {
  const input: Input = getInput(event);

  // When dragging from outside of the browser,
  // the drag is not being sourced from any local drop targets
  if (dragType.startedFrom === 'external') {
    return {
      input,
      dropTargets: [],
    };
  }

  const dropTargets: DropTargetRecord[] = getDropTargetsOver({
    input,
    source: dragType.payload,
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
